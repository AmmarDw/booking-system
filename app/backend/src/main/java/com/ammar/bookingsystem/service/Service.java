package com.ammar.bookingsystem.service;

import com.ammar.bookingsystem.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;

// Note: named "Service" to match the domain/ERD (PROJECT_REPORT.md §7), not the Spring stereotype.
// Business-logic classes in this package must fully-qualify @org.springframework.stereotype.Service
// to avoid a name clash with this entity.
@Entity
@Table(name = "services")
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @ManyToMany(mappedBy = "services")
    private Set<User> providers = new HashSet<>();

    protected Service() {
        // JPA
    }

    public Service(String name, String description, Integer durationMinutes) {
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Set<User> getProviders() {
        return providers;
    }
}
