package com.ammar.bookingsystem.google;

import com.ammar.bookingsystem.google.dto.AuthorizeResponse;
import com.ammar.bookingsystem.google.dto.ConnectionStatusResponse;
import com.ammar.bookingsystem.google.dto.FallbackLinkRequest;
import com.ammar.bookingsystem.security.CurrentUser;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Self-service only — each provider connects/manages their own Google account (CLAUDE.md §B.6).
// /callback is public in SecurityConfig: Google's redirect is a plain browser navigation carrying
// no Authorization header, so the "which provider" association travels via the signed `state`
// param instead (see JwtService#generateOAuthState).
@RestController
@RequestMapping("/api/google")
public class GoogleOAuthController {

    private final GoogleOAuthService googleOAuthService;

    public GoogleOAuthController(GoogleOAuthService googleOAuthService) {
        this.googleOAuthService = googleOAuthService;
    }

    @GetMapping("/oauth2/authorize")
    @PreAuthorize("hasRole('PROVIDER')")
    public AuthorizeResponse authorize() {
        Long providerId = CurrentUser.get().getId();
        return new AuthorizeResponse(googleOAuthService.buildAuthorizationUrl(providerId));
    }

    @GetMapping("/oauth2/callback")
    public void callback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            HttpServletResponse response)
            throws IOException {
        // If the provider clicks "Cancel" on Google's consent screen, Google redirects here with
        // `error=access_denied` and no `code` at all — never call into the token exchange in that
        // case, just bounce back to the frontend with a readable error instead of 500ing.
        if (error != null || code == null || state == null) {
            response.sendRedirect("/dashboard/connect-google?error=consent_denied");
            return;
        }
        String redirectPath = googleOAuthService.handleCallback(code, state);
        response.sendRedirect(redirectPath);
    }

    @GetMapping("/connection")
    @PreAuthorize("hasRole('PROVIDER')")
    public ConnectionStatusResponse status() {
        return googleOAuthService.getStatus(CurrentUser.get().getId());
    }

    @DeleteMapping("/connection")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Void> disconnect() {
        googleOAuthService.disconnect(CurrentUser.get().getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/fallback-link")
    @PreAuthorize("hasRole('PROVIDER')")
    public ConnectionStatusResponse setFallbackLink(@Valid @RequestBody FallbackLinkRequest request) {
        Long providerId = CurrentUser.get().getId();
        googleOAuthService.setFallbackLink(providerId, request.url());
        return googleOAuthService.getStatus(providerId);
    }
}
