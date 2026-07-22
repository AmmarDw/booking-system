package com.ammar.bookingsystem.booking;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByConsumerUserId(Long consumerUserId);

    List<Booking> findBySlotProviderUserId(Long providerUserId);
}
