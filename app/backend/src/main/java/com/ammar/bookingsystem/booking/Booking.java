package com.ammar.bookingsystem.booking;

import com.ammar.bookingsystem.availability.AvailabilitySlot;
import com.ammar.bookingsystem.service.Service;
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
import java.time.OffsetDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "consumer_user_id", nullable = false)
    private User consumerUser;

    @ManyToOne
    @JoinColumn(name = "slot_id", nullable = false)
    private AvailabilitySlot slot;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    protected Booking() {
        // JPA
    }

    public Booking(User consumerUser, AvailabilitySlot slot, Service service) {
        this.consumerUser = consumerUser;
        this.slot = slot;
        this.service = service;
    }

    public Long getId() {
        return id;
    }

    public User getConsumerUser() {
        return consumerUser;
    }

    public AvailabilitySlot getSlot() {
        return slot;
    }

    public Service getService() {
        return service;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
