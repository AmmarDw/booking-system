package com.ammar.bookingsystem.user.dto;

import com.ammar.bookingsystem.user.Role;
import jakarta.validation.constraints.NotNull;

// Role change here is the "promote consumer to provider" mechanism (FR-16).
public record UpdateUserRequest(String fullName, @NotNull Role role) {}
