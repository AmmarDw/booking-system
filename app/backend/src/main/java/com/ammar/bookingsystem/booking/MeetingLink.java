package com.ammar.bookingsystem.booking;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "meeting_links")
public class MeetingLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(nullable = false, length = 50)
    private String provider = "GOOGLE_MEET";

    protected MeetingLink() {
        // JPA
    }

    public MeetingLink(Booking booking, String url) {
        this.booking = booking;
        this.url = url;
    }

    public Long getId() {
        return id;
    }

    public Booking getBooking() {
        return booking;
    }

    public String getUrl() {
        return url;
    }

    public String getProvider() {
        return provider;
    }
}
