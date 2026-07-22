package com.ammar.bookingsystem.availability;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {

    List<AvailabilitySlot> findByProviderUserIdAndSlotDate(Long providerUserId, LocalDate slotDate);

    List<AvailabilitySlot> findByProviderUserIdAndSlotDateBetween(
            Long providerUserId, LocalDate startDate, LocalDate endDate);
}
