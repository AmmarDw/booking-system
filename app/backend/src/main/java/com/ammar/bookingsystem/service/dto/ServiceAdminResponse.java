package com.ammar.bookingsystem.service.dto;

import com.ammar.bookingsystem.service.Service;
import java.util.Comparator;
import java.util.List;

public record ServiceAdminResponse(
        Long id, String name, String description, Integer durationMinutes, List<ProviderSummary> providers) {

    public static ServiceAdminResponse from(Service service) {
        List<ProviderSummary> providers = service.getProviders().stream()
                .map(ProviderSummary::from)
                .sorted(Comparator.comparing(ProviderSummary::name))
                .toList();
        return new ServiceAdminResponse(
                service.getId(), service.getName(), service.getDescription(), service.getDurationMinutes(), providers);
    }
}
