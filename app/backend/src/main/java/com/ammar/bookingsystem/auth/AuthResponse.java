package com.ammar.bookingsystem.auth;

public record AuthResponse(Long id, String token, String email, String role, String fullName) {}
