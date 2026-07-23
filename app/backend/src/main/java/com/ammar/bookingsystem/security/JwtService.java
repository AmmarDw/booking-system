package com.ammar.bookingsystem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expirationMs) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("app.jwt.secret (JWT_SECRET env var) must be set");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    /** Throws io.jsonwebtoken.JwtException (expired/invalid/malformed) — caller decides how to handle. */
    public Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    // --- Google OAuth "state" param (FR-13) ---
    // Google's callback redirect is a plain browser navigation, so it carries no Authorization
    // header — there's no way to know "which provider" via the normal JWT filter. Instead we mint
    // a short-lived, signed token embedding the initiating provider's id and pass it as `state`;
    // Google echoes it back unmodified, and the callback verifies+decodes it. Reuses this same
    // signing key/library — distinct claim ("purpose") keeps it from being confused with a real
    // auth token, and the short expiry limits how long a leaked state value would be useful.
    private static final long STATE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes
    private static final String STATE_PURPOSE = "google_oauth_state";

    public String generateOAuthState(Long userId) {
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("purpose", STATE_PURPOSE)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + STATE_EXPIRATION_MS))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    /** Throws JwtException if invalid/expired/wrong purpose. */
    public Long parseOAuthState(String state) {
        Claims claims = parseClaims(state);
        if (!STATE_PURPOSE.equals(claims.get("purpose", String.class))) {
            throw new io.jsonwebtoken.JwtException("Not a Google OAuth state token");
        }
        return Long.valueOf(claims.getSubject());
    }
}
