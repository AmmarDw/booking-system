package com.ammar.bookingsystem.service;

import com.ammar.bookingsystem.service.dto.AssignProvidersRequest;
import com.ammar.bookingsystem.service.dto.CreateServiceRequest;
import com.ammar.bookingsystem.service.dto.ProviderSummary;
import com.ammar.bookingsystem.service.dto.ServiceAdminResponse;
import com.ammar.bookingsystem.service.dto.ServiceResponse;
import com.ammar.bookingsystem.user.Role;
import com.ammar.bookingsystem.user.User;
import com.ammar.bookingsystem.user.UserRepository;
import jakarta.validation.Valid;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

// GET /api/services and GET /api/services/{id} are public (FR-1, permitted in SecurityConfig).
// Everything else here is admin-only (FR-8).
@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public ServiceController(ServiceRepository serviceRepository, UserRepository userRepository) {
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
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

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ServiceAdminResponse> adminList() {
        return serviceRepository.findAll().stream().map(ServiceAdminResponse::from).toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ServiceAdminResponse create(@Valid @RequestBody CreateServiceRequest request) {
        Service service = new Service(request.name(), request.description(), request.durationMinutes());
        serviceRepository.save(service);
        return ServiceAdminResponse.from(service);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ServiceAdminResponse update(@PathVariable Long id, @Valid @RequestBody CreateServiceRequest request) {
        Service service = findOrThrow(id);
        service.setName(request.name());
        service.setDescription(request.description());
        service.setDurationMinutes(request.durationMinutes());
        serviceRepository.save(service);
        return ServiceAdminResponse.from(service);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Service service = findOrThrow(id);
        serviceRepository.delete(service);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/providers")
    @PreAuthorize("hasRole('ADMIN')")
    public ServiceAdminResponse assignProviders(@PathVariable Long id, @RequestBody AssignProvidersRequest request) {
        Service service = findOrThrow(id);
        List<Long> requestedIds = request.providerIds() == null ? List.of() : request.providerIds();
        List<User> requestedProviders = userRepository.findAllById(requestedIds);
        for (User provider : requestedProviders) {
            if (provider.getRole() != Role.PROVIDER) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, provider.getEmail() + " is not a provider");
            }
        }

        // Service.getProviders() is the INVERSE side of the @ManyToMany (owned by User.services) —
        // mutating it doesn't persist to user_services. Update each affected User's own side instead.
        Set<User> newSet = new HashSet<>(requestedProviders);
        Set<User> currentSet = new HashSet<>(service.getProviders());

        for (User removed : currentSet) {
            if (!newSet.contains(removed)) {
                removed.getServices().remove(service);
                userRepository.save(removed);
            }
        }
        for (User added : newSet) {
            if (!currentSet.contains(added)) {
                added.getServices().add(service);
                userRepository.save(added);
            }
        }

        // NOT serviceRepository.findById(id) here — Hibernate's first-level cache would return the
        // same Service instance loaded at the top of this method, whose (lazily-loaded) inverse-side
        // `providers` collection was already materialized *before* the updates above and doesn't
        // auto-refresh just because the owning side changed elsewhere in this persistence context.
        // We already know the correct new set, so build the response from it directly.
        List<ProviderSummary> providers =
                newSet.stream().map(ProviderSummary::from).sorted(Comparator.comparing(ProviderSummary::name)).toList();
        return new ServiceAdminResponse(service.getId(), service.getName(), service.getDescription(), service.getDurationMinutes(), providers);
    }

    private Service findOrThrow(Long id) {
        return serviceRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }
}
