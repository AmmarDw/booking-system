package com.ammar.bookingsystem.service.dto;

import com.ammar.bookingsystem.service.Service;

public record ServiceResponse(Long id, String name, String description, Integer durationMinutes) {

    public static ServiceResponse from(Service service) {
        return new ServiceResponse(
                service.getId(), service.getName(), service.getDescription(), service.getDurationMinutes());
    }
}
