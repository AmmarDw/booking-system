package com.ammar.bookingsystem.google;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.ConferenceData;
import com.google.api.services.calendar.model.ConferenceSolutionKey;
import com.google.api.services.calendar.model.CreateConferenceRequest;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

// Creates the booking's Calendar event + Meet link on the PROVIDER's own calendar (FR-6,
// CLAUDE.md §B.6: events.insert, conferenceDataVersion=1, conferenceData.createRequest,
// hangoutsMeet, attendees=[consumer,provider], sendUpdates=all). Never throws — a failure here
// must not break the booking itself (NFR-4); callers check for a null return instead.
@Component
public class GoogleCalendarService {

    private static final Logger log = LoggerFactory.getLogger(GoogleCalendarService.class);

    private final String clientId;
    private final String clientSecret;
    private final TokenCipher tokenCipher;

    public GoogleCalendarService(
            @Value("${google.client-id}") String clientId,
            @Value("${google.client-secret}") String clientSecret,
            TokenCipher tokenCipher) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenCipher = tokenCipher;
    }

    /** Returns the Google Meet URL, or null if event/Meet-link creation failed for any reason. */
    public String createMeetingEvent(
            String encryptedRefreshToken,
            String summary,
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime,
            String consumerEmail,
            String providerEmail) {
        try {
            String refreshToken = tokenCipher.decrypt(encryptedRefreshToken);
            Calendar calendar = buildCalendarClient(refreshToken);

            ZoneId zone = ZoneId.systemDefault();
            EventDateTime start = new EventDateTime()
                    .setDateTime(new com.google.api.client.util.DateTime(
                            ZonedDateTime.of(date, startTime, zone).toInstant().toEpochMilli()));
            EventDateTime end = new EventDateTime()
                    .setDateTime(new com.google.api.client.util.DateTime(
                            ZonedDateTime.of(date, endTime, zone).toInstant().toEpochMilli()));

            Event event = new Event()
                    .setSummary(summary)
                    .setStart(start)
                    .setEnd(end)
                    .setAttendees(List.of(new EventAttendee().setEmail(consumerEmail), new EventAttendee().setEmail(providerEmail)))
                    .setConferenceData(new ConferenceData()
                            .setCreateRequest(new CreateConferenceRequest()
                                    .setRequestId(UUID.randomUUID().toString())
                                    .setConferenceSolutionKey(new ConferenceSolutionKey().setType("hangoutsMeet"))));

            Event created = calendar
                    .events()
                    .insert("primary", event)
                    .setConferenceDataVersion(1)
                    .setSendUpdates("all")
                    .execute();

            return created.getHangoutLink();
        } catch (Exception e) {
            log.error("Failed to create Google Calendar event / Meet link (booking still succeeds, NFR-4)", e);
            return null;
        }
    }

    private Calendar buildCalendarClient(String refreshToken) throws Exception {
        HttpTransport transport = GoogleNetHttpTransport.newTrustedTransport();
        GsonFactory jsonFactory = GsonFactory.getDefaultInstance();
        // GoogleCredential is deprecated in favor of com.google.auth's UserCredentials, but it's
        // still fully functional and is what's already transitively on the classpath via
        // google-api-client — switching would mean adding and verifying a whole new,
        // as-yet-unused dependency (google-auth-library-oauth2-http) for no functional gain here.
        @SuppressWarnings("deprecation")
        GoogleCredential credential = new GoogleCredential.Builder()
                .setTransport(transport)
                .setJsonFactory(jsonFactory)
                .setClientSecrets(clientId, clientSecret)
                .build()
                .setRefreshToken(refreshToken);
        return new Calendar.Builder(transport, jsonFactory, credential)
                .setApplicationName("BookIt")
                .build();
    }
}
