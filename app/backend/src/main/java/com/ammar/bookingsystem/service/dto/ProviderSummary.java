package com.ammar.bookingsystem.service.dto;

import com.ammar.bookingsystem.user.User;

public record ProviderSummary(Long id, String name) {

    public static ProviderSummary from(User user) {
        String name = user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName() : user.getEmail();
        return new ProviderSummary(user.getId(), name);
    }
}
