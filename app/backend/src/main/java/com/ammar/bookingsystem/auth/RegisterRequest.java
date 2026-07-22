package com.ammar.bookingsystem.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Deliberately has NO role field (FR-16): public self-registration can never set PROVIDER/ADMIN
// because there is nothing here to bind it to, regardless of what a crafted request body contains.
public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password,
        String fullName) {}
