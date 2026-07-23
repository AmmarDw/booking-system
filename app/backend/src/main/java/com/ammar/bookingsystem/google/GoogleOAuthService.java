package com.ammar.bookingsystem.google;

import com.ammar.bookingsystem.google.dto.ConnectionStatusResponse;
import com.ammar.bookingsystem.security.JwtService;
import com.ammar.bookingsystem.user.Role;
import com.ammar.bookingsystem.user.User;
import com.ammar.bookingsystem.user.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.auth.oauth2.TokenResponse;
import java.security.GeneralSecurityException;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

// Provider Google Calendar onboarding (FR-13). Each provider connects their own account once;
// GoogleCalendarService (M6) uses the stored refresh token later to create Meet-enabled events.
@Component
public class GoogleOAuthService {

    private static final String USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final List<String> scopes;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final GoogleAccountConnectionRepository connectionRepository;
    private final TokenCipher tokenCipher;

    public GoogleOAuthService(
            @Value("${google.client-id}") String clientId,
            @Value("${google.client-secret}") String clientSecret,
            @Value("${google.redirect-uri}") String redirectUri,
            @Value("${google.scope}") String scope,
            JwtService jwtService,
            UserRepository userRepository,
            GoogleAccountConnectionRepository connectionRepository,
            TokenCipher tokenCipher) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.scopes = Arrays.asList(scope.trim().split("\\s+"));
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.connectionRepository = connectionRepository;
        this.tokenCipher = tokenCipher;
    }

    public String buildAuthorizationUrl(Long providerId) {
        String state = jwtService.generateOAuthState(providerId);
        GoogleAuthorizationCodeFlow flow = buildFlow();
        return flow.newAuthorizationUrl()
                .setRedirectUri(redirectUri)
                .setState(state)
                // Force the consent screen every time so Google always issues a refresh_token,
                // even on a reconnect (Google otherwise only grants one on the very first consent).
                .set("prompt", "consent")
                .build();
    }

    /** Returns the frontend path to redirect the browser to after processing the callback. */
    public String handleCallback(String code, String state) {
        Long providerId;
        try {
            providerId = jwtService.parseOAuthState(state);
        } catch (Exception e) {
            return "/dashboard/connect-google?error=invalid_state";
        }

        User provider = userRepository.findById(providerId).orElse(null);
        if (provider == null || provider.getRole() != Role.PROVIDER) {
            return "/dashboard/connect-google?error=invalid_provider";
        }

        try {
            GoogleAuthorizationCodeFlow flow = buildFlow();
            TokenResponse tokenResponse =
                    flow.newTokenRequest(code).setRedirectUri(redirectUri).execute();
            String refreshToken = tokenResponse.getRefreshToken();
            if (refreshToken == null) {
                return "/dashboard/connect-google?error=no_refresh_token";
            }
            String email = fetchEmail(tokenResponse.getAccessToken());

            GoogleAccountConnection connection = connectionRepository
                    .findByUserId(providerId)
                    .orElseGet(() -> new GoogleAccountConnection(provider));
            connection.setGoogleEmail(email);
            connection.setRefreshTokenEnc(tokenCipher.encrypt(refreshToken));
            connection.setScope(String.join(" ", scopes));
            connection.setConnectedAt(OffsetDateTime.now());
            connectionRepository.save(connection);

            return "/dashboard/connect-google?connected=true";
        } catch (Exception e) {
            return "/dashboard/connect-google?error=exchange_failed";
        }
    }

    public ConnectionStatusResponse getStatus(Long userId) {
        return connectionRepository
                .findByUserId(userId)
                .map(c -> new ConnectionStatusResponse(
                        c.getRefreshTokenEnc() != null, c.getGoogleEmail(), c.getConnectedAt(), c.getFallbackMeetUrl()))
                .orElse(new ConnectionStatusResponse(false, null, null, null));
    }

    public void disconnect(Long userId) {
        connectionRepository.findByUserId(userId).ifPresent(connectionRepository::delete);
    }

    public void setFallbackLink(Long userId, String url) {
        User provider = userRepository
                .findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        GoogleAccountConnection connection =
                connectionRepository.findByUserId(userId).orElseGet(() -> new GoogleAccountConnection(provider));
        connection.setFallbackMeetUrl(url);
        connectionRepository.save(connection);
    }

    private GoogleAuthorizationCodeFlow buildFlow() {
        try {
            HttpTransport transport = GoogleNetHttpTransport.newTrustedTransport();
            JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
            return new GoogleAuthorizationCodeFlow.Builder(transport, jsonFactory, clientId, clientSecret, scopes)
                    .setAccessType("offline")
                    .build();
        } catch (GeneralSecurityException | java.io.IOException e) {
            throw new IllegalStateException("Could not initialize Google OAuth flow", e);
        }
    }

    private String fetchEmail(String accessToken) {
        try {
            HttpTransport transport = GoogleNetHttpTransport.newTrustedTransport();
            HttpRequestFactory requestFactory = transport.createRequestFactory();
            HttpRequest request = requestFactory.buildGetRequest(new GenericUrl(USERINFO_URL));
            request.getHeaders().setAuthorization("Bearer " + accessToken);
            request.setParser(new JsonObjectParser(GsonFactory.getDefaultInstance()));
            GoogleUserInfo userInfo = request.execute().parseAs(GoogleUserInfo.class);
            return userInfo.email;
        } catch (Exception e) {
            return null;
        }
    }
}
