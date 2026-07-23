package com.ammar.bookingsystem.booking;

import com.ammar.bookingsystem.availability.AvailabilitySlot;
import com.ammar.bookingsystem.availability.AvailabilitySlotRepository;
import com.ammar.bookingsystem.availability.SlotStatus;
import com.ammar.bookingsystem.booking.dto.BookingResponse;
import com.ammar.bookingsystem.booking.dto.CreateBookingRequest;
import com.ammar.bookingsystem.config.AppSettingsCache;
import com.ammar.bookingsystem.email.EmailService;
import com.ammar.bookingsystem.google.GoogleAccountConnection;
import com.ammar.bookingsystem.google.GoogleAccountConnectionRepository;
import com.ammar.bookingsystem.google.GoogleCalendarService;
import com.ammar.bookingsystem.service.Service;
import com.ammar.bookingsystem.service.ServiceRepository;
import com.ammar.bookingsystem.user.User;
import com.ammar.bookingsystem.user.UserRepository;
import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// Named BookingService (plain @Component, not @Service) purely to avoid the name clash the
// com.ammar.bookingsystem.service.Service import would otherwise cause in this file — see
// CLAUDE.md §B.8.
@Component
public class BookingService {

    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final AppSettingsCache appSettingsCache;
    private final GoogleAccountConnectionRepository googleAccountConnectionRepository;
    private final GoogleCalendarService googleCalendarService;
    private final MeetingLinkRepository meetingLinkRepository;
    private final EmailService emailService;

    public BookingService(
            AvailabilitySlotRepository availabilitySlotRepository,
            ServiceRepository serviceRepository,
            UserRepository userRepository,
            BookingRepository bookingRepository,
            AppSettingsCache appSettingsCache,
            GoogleAccountConnectionRepository googleAccountConnectionRepository,
            GoogleCalendarService googleCalendarService,
            MeetingLinkRepository meetingLinkRepository,
            EmailService emailService) {
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.appSettingsCache = appSettingsCache;
        this.googleAccountConnectionRepository = googleAccountConnectionRepository;
        this.googleCalendarService = googleCalendarService;
        this.meetingLinkRepository = meetingLinkRepository;
        this.emailService = emailService;
    }

    @Transactional
    public BookingResponse createBooking(Long consumerUserId, CreateBookingRequest request) {
        // Pessimistic row lock: two concurrent requests for the same slot can't both pass the
        // AVAILABLE check below — the second waits for the first's transaction to commit/rollback,
        // then re-reads the now-BOOKED status (FR-4).
        AvailabilitySlot slot = availabilitySlotRepository
                .findByIdForUpdate(request.slotId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));

        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This slot has already been booked");
        }

        LocalDate today = LocalDate.now();
        LocalDate maxBookable = today.plusMonths(appSettingsCache.getMaxHorizonMonths());
        if (slot.getSlotDate().isBefore(today)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This date is in the past");
        }
        if (slot.getSlotDate().isAfter(maxBookable)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This date is beyond the booking window");
        }

        Service service = serviceRepository
                .findById(request.serviceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
        boolean providerOffersService = slot.getProviderUser().getServices().stream()
                .anyMatch(s -> s.getId().equals(service.getId()));
        if (!providerOffersService) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This provider does not offer that service");
        }

        // FR-13: a provider isn't bookable until they've connected Google or set a fallback link.
        GoogleAccountConnection connection =
                googleAccountConnectionRepository.findByUserId(slot.getProviderUser().getId()).orElse(null);
        boolean hasOAuth = connection != null && connection.getRefreshTokenEnc() != null;
        boolean hasFallback = connection != null && connection.getFallbackMeetUrl() != null;
        if (!hasOAuth && !hasFallback) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "This provider hasn't set up a meeting link yet — please try another provider");
        }

        // The slot belongs to the provider, not the service — booking it here reserves it across
        // every service that provider offers (PROJECT_REPORT.md §7 key rule; FR-4).
        slot.setStatus(SlotStatus.BOOKED);
        availabilitySlotRepository.save(slot);

        User consumer = userRepository.getReferenceById(consumerUserId);
        Booking booking = new Booking(consumer, slot, service);
        bookingRepository.save(booking);

        // FR-6: generate the Meet link — via the provider's own calendar if connected, else their
        // pasted fallback link. A failure here must not fail the booking itself (NFR-4).
        String meetingLink = hasOAuth
                ? googleCalendarService.createMeetingEvent(
                        connection.getRefreshTokenEnc(),
                        service.getName(),
                        slot.getSlotDate(),
                        slot.getStartTime(),
                        slot.getEndTime(),
                        consumer.getEmail(),
                        slot.getProviderUser().getEmail())
                : connection.getFallbackMeetUrl();
        if (meetingLink != null) {
            meetingLinkRepository.save(new MeetingLink(booking, meetingLink));
        }

        // FR-5: confirmation email — also never allowed to fail the booking (EmailService itself
        // catches and logs internally).
        emailService.sendBookingConfirmation(
                consumer.getEmail(), service.getName(), slot.getSlotDate(), slot.getStartTime(), meetingLink);

        return new BookingResponse(
                booking.getId(),
                service.getName(),
                displayName(slot.getProviderUser()),
                slot.getSlotDate(),
                slot.getStartTime(),
                slot.getEndTime(),
                booking.getStatus().name());
    }

    private static String displayName(User user) {
        return user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : user.getEmail();
    }
}
