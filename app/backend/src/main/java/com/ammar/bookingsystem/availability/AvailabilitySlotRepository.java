package com.ammar.bookingsystem.availability;

import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {

    List<AvailabilitySlot> findByProviderUserIdAndSlotDate(Long providerUserId, LocalDate slotDate);

    List<AvailabilitySlot> findByProviderUserIdAndSlotDateBetween(
            Long providerUserId, LocalDate startDate, LocalDate endDate);

    List<AvailabilitySlot> findByProviderUserIdInAndSlotDate(List<Long> providerUserIds, LocalDate slotDate);

    List<AvailabilitySlot> findByProviderUserIdInAndSlotDateBetween(
            List<Long> providerUserIds, LocalDate startDate, LocalDate endDate);

    // SELECT ... FOR UPDATE — row-locks the slot for the duration of the booking transaction so
    // two concurrent booking attempts on the same slot can't both see it as AVAILABLE (FR-4).
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from AvailabilitySlot s where s.id = :id")
    Optional<AvailabilitySlot> findByIdForUpdate(@Param("id") Long id);
}
