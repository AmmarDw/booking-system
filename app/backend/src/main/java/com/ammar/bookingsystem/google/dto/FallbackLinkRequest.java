package com.ammar.bookingsystem.google.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record FallbackLinkRequest(
        @NotBlank @Pattern(regexp = "^https?://.+", message = "Must be a valid http(s) URL") String url) {}
