package com.ammar.bookingsystem.availability.dto;

import java.util.List;

// One entry per provider offering the service who has at least one slot on the requested date —
// rendered as stacked provider dropdowns on the frontend (FR-3).
public record ProviderDaySlots(Long providerId, String providerName, List<SlotInfo> slots) {}
