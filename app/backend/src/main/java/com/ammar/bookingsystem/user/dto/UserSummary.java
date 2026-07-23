package com.ammar.bookingsystem.user.dto;

import com.ammar.bookingsystem.user.Role;
import com.ammar.bookingsystem.user.User;
import java.time.OffsetDateTime;

public record UserSummary(Long id, String email, String fullName, Role role, OffsetDateTime createdAt) {

    public static UserSummary from(User user) {
        return new UserSummary(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getCreatedAt());
    }
}
