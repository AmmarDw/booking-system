package com.ammar.bookingsystem.user.dto;

import com.ammar.bookingsystem.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// Only the admin Users screen uses this — unlike public /api/auth/register, this DOES accept a
// role (FR-16: only an admin may grant PROVIDER/ADMIN).
public record CreateUserRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password,
        String fullName,
        @NotNull Role role) {}
