package com.ammar.bookingsystem.google.dto;

import java.time.OffsetDateTime;

public record ConnectionStatusResponse(
        boolean connected, String googleEmail, OffsetDateTime connectedAt, String fallbackMeetUrl) {}
