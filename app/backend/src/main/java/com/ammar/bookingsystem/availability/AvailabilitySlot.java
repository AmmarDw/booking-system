package com.ammar.bookingsystem.availability;

import com.ammar.bookingsystem.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDate;
import java.time.LocalTime;

// Bound to the provider, not to a service — booking one service reserves it across all that
// provider's services (PROJECT_REPORT.md §7 key rule; FR-4).
@Entity
@Table(
        name = "availability_slots",
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uq_provider_slot",
                        columnNames = {"provider_user_id", "slot_date", "start_time"}))
public class AvailabilitySlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "provider_user_id", nullable = false)
    private User providerUser;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SlotStatus status = SlotStatus.AVAILABLE;

    protected AvailabilitySlot() {
        // JPA
    }

    public AvailabilitySlot(User providerUser, LocalDate slotDate, LocalTime startTime, LocalTime endTime) {
        this.providerUser = providerUser;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public User getProviderUser() {
        return providerUser;
    }

    public LocalDate getSlotDate() {
        return slotDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public SlotStatus getStatus() {
        return status;
    }

    public void setStatus(SlotStatus status) {
        this.status = status;
    }
}
