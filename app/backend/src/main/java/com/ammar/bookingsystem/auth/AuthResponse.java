package com.ammar.bookingsystem.auth;

public record AuthResponse(String token, String email, String role, String fullName) {}
