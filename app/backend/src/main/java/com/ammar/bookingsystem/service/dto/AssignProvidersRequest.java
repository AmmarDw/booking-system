package com.ammar.bookingsystem.service.dto;

import java.util.List;

// Replaces the full set of providers offering this service (admin services-management screen).
public record AssignProvidersRequest(List<Long> providerIds) {}
