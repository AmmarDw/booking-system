package com.ammar.bookingsystem.google;

import com.ammar.bookingsystem.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

// Per-provider Google OAuth connection powering Meet-link creation (FR-13). refreshTokenEnc is
// stored encrypted (see TokenCipher, M6) — never persist the raw refresh token.
@Entity
@Table(name = "google_account_connections")
public class GoogleAccountConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "google_email")
    private String googleEmail;

    @Column(name = "refresh_token_enc", columnDefinition = "text")
    private String refreshTokenEnc;

    private String scope;

    @Column(name = "connected_at")
    private OffsetDateTime connectedAt;

    @Column(name = "fallback_meet_url", length = 500)
    private String fallbackMeetUrl;

    protected GoogleAccountConnection() {
        // JPA
    }

    public GoogleAccountConnection(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getGoogleEmail() {
        return googleEmail;
    }

    public void setGoogleEmail(String googleEmail) {
        this.googleEmail = googleEmail;
    }

    public String getRefreshTokenEnc() {
        return refreshTokenEnc;
    }

    public void setRefreshTokenEnc(String refreshTokenEnc) {
        this.refreshTokenEnc = refreshTokenEnc;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public OffsetDateTime getConnectedAt() {
        return connectedAt;
    }

    public void setConnectedAt(OffsetDateTime connectedAt) {
        this.connectedAt = connectedAt;
    }

    public String getFallbackMeetUrl() {
        return fallbackMeetUrl;
    }

    public void setFallbackMeetUrl(String fallbackMeetUrl) {
        this.fallbackMeetUrl = fallbackMeetUrl;
    }
}
