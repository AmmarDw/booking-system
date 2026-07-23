package com.ammar.bookingsystem.service;

import com.ammar.bookingsystem.service.dto.ServiceResponse;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

// Public read-only endpoints (FR-1) — permitted in SecurityConfig for GET /api/services/**.
// Admin CRUD for services is added in M5.
@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceRepository serviceRepository;

    public ServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public List<ServiceResponse> list() {
        return serviceRepository.findAll().stream().map(ServiceResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ServiceResponse get(@PathVariable Long id) {
        return serviceRepository
                .findById(id)
                .map(ServiceResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }
}
