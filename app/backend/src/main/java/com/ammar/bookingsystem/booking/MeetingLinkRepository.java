package com.ammar.bookingsystem.booking;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingLinkRepository extends JpaRepository<MeetingLink, Long> {

    Optional<MeetingLink> findByBookingId(Long bookingId);
}
