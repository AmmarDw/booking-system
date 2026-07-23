package com.ammar.bookingsystem.availability;

import com.ammar.bookingsystem.availability.dto.BulkGenerateRequest;
import com.ammar.bookingsystem.availability.dto.BulkGenerateResponse;
import com.ammar.bookingsystem.availability.dto.ManagementSlotInfo;
import com.ammar.bookingsystem.security.CurrentUser;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Provider self-service (own only) or admin (any provider) — FR-7. Not public.
@RestController
@RequestMapping("/api/availability")
@PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
public class AvailabilityManagementController {

    private final AvailabilityManagementService availabilityManagementService;

    public AvailabilityManagementController(AvailabilityManagementService availabilityManagementService) {
        this.availabilityManagementService = availabilityManagementService;
    }

    @PostMapping("/bulk")
    public BulkGenerateResponse bulkGenerate(@Valid @RequestBody BulkGenerateRequest request) {
        return availabilityManagementService.bulkGenerate(CurrentUser.get().getUser(), request);
    }

    @GetMapping
    public List<ManagementSlotInfo> list(
            @RequestParam(required = false) Long providerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return availabilityManagementService.listSlots(CurrentUser.get().getUser(), providerId, from, to);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        availabilityManagementService.deleteSlot(CurrentUser.get().getUser(), id);
        return ResponseEntity.noContent().build();
    }
}
