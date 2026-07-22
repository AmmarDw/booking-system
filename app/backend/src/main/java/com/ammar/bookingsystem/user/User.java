package com.ammar.bookingsystem.user;

import com.ammar.bookingsystem.availability.AvailabilitySlot;
import com.ammar.bookingsystem.booking.Booking;
import com.ammar.bookingsystem.google.GoogleAccountConnection;
import com.ammar.bookingsystem.service.Service;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.CreationTimestamp;

// One entity for all roles (CONSUMER/PROVIDER/ADMIN) — no separate Provider entity (PROJECT_REPORT.md §7).
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    // Services this user offers, when role = PROVIDER (user_services join table, FR-7/FR-13).
    @ManyToMany
    @JoinTable(
            name = "user_services",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id"))
    private Set<Service> services = new HashSet<>();

    @OneToMany(mappedBy = "providerUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AvailabilitySlot> availabilitySlots = new HashSet<>();

    @OneToMany(mappedBy = "consumerUser")
    private Set<Booking> bookings = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private GoogleAccountConnection googleAccountConnection;

    protected User() {
        // JPA
    }

    public User(String email, String passwordHash, String fullName, Role role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public Set<Service> getServices() {
        return services;
    }

    public Set<AvailabilitySlot> getAvailabilitySlots() {
        return availabilitySlots;
    }

    public Set<Booking> getBookings() {
        return bookings;
    }

    public GoogleAccountConnection getGoogleAccountConnection() {
        return googleAccountConnection;
    }
}
