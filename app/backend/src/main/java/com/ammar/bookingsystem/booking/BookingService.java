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
import com.ammar.bookingsystem.user.Role;
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

        // A provider may book other providers' services as a consumer, but never their own
        // availability — checked here (not just filtered out in the UI) so it can't be bypassed
        // by calling the API directly.
        if (slot.getProviderUser().getId().equals(consumerUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot book your own availability");
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

        // FR-5: confirmation email to the consumer, plus a notification to the provider so they
        // know a new booking landed on their calendar — neither is allowed to fail the booking
        // itself (EmailService catches and logs internally).
        emailService.sendBookingConfirmation(
                consumer.getEmail(),
                service.getName(),
                slot.getSlotDate(),
                slot.getStartTime(),
                meetingLink,
                displayName(slot.getProviderUser()),
                slot.getProviderUser().getEmail());
        emailService.sendProviderBookingNotification(
                slot.getProviderUser().getEmail(),
                service.getName(),
                slot.getSlotDate(),
                slot.getStartTime(),
                meetingLink,
                displayName(consumer),
                consumer.getEmail());

        return new BookingResponse(
                booking.getId(),
                service.getName(),
                displayName(slot.getProviderUser()),
                slot.getSlotDate(),
                slot.getStartTime(),
                slot.getEndTime(),
                booking.getStatus().name());
    }

    // Status transitions (Phase 4). Only a CONFIRMED booking can transition; terminal states are
    // final. Role decides the allowed targets, and time gates decide when they're allowed:
    //   CONSUMER          → CANCELLED (only >24h before the slot start), NO_SHOW (only after end)
    //   PROVIDER / ADMIN  → COMPLETED (only after end),                 NO_SHOW (only after end)
    // CANCELLED frees the slot back to AVAILABLE; COMPLETED/NO_SHOW leave it BOOKED.
    @Transactional
    public BookingResponse updateStatus(Long bookingId, Long callerId, Role callerRole, BookingStatus target) {
        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        boolean isConsumer = booking.getConsumerUser().getId().equals(callerId);
        boolean isProvider = booking.getSlot().getProviderUser().getId().equals(callerId);
        boolean allowed =
                callerRole == Role.ADMIN
                        || (callerRole == Role.CONSUMER && isConsumer)
                        || (callerRole == Role.PROVIDER && isProvider);
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can't change this appointment");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "This appointment is already " + booking.getStatus().name().toLowerCase());
        }

        // Providers/admins act in the provider capacity here; a consumer-role caller acts as the
        // consumer. (A provider who booked someone else's slot as a consumer is handled as a
        // consumer by their CONSUMER-less role never matching here — they're PROVIDER globally, but
        // for *their own* consumer bookings isConsumer is true and the consumer branch applies.)
        boolean actingAsConsumer = callerRole == Role.CONSUMER || (isConsumer && !isProvider);
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.time.LocalDateTime slotStart =
                java.time.LocalDateTime.of(booking.getSlot().getSlotDate(), booking.getSlot().getStartTime());
        java.time.LocalDateTime slotEnd =
                java.time.LocalDateTime.of(booking.getSlot().getSlotDate(), booking.getSlot().getEndTime());

        switch (target) {
            case CANCELLED -> {
                if (!actingAsConsumer) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the consumer can cancel");
                }
                if (!now.isBefore(slotStart.minusHours(24))) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Appointments can't be cancelled within 24 hours of the start time");
                }
                AvailabilitySlot slot = booking.getSlot();
                slot.setStatus(SlotStatus.AVAILABLE);
                availabilitySlotRepository.save(slot);
            }
            case COMPLETED -> {
                if (actingAsConsumer) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the provider can complete an appointment");
                }
                if (!now.isAfter(slotEnd)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "An appointment can only be completed after it has ended");
                }
            }
            case NO_SHOW -> {
                if (!now.isAfter(slotEnd)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "No-show can only be set after the appointment has ended");
                }
            }
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported status transition");
        }

        booking.setStatus(target);
        bookingRepository.save(booking);

        return new BookingResponse(
                booking.getId(),
                booking.getService().getName(),
                displayName(booking.getSlot().getProviderUser()),
                booking.getSlot().getSlotDate(),
                booking.getSlot().getStartTime(),
                booking.getSlot().getEndTime(),
                booking.getStatus().name());
    }

    private static String displayName(User user) {
        return user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : user.getEmail();
    }
}
