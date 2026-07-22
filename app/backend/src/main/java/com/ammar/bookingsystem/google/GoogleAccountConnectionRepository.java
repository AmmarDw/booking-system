package com.ammar.bookingsystem.google;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoogleAccountConnectionRepository extends JpaRepository<GoogleAccountConnection, Long> {

    Optional<GoogleAccountConnection> findByUserId(Long userId);
}
