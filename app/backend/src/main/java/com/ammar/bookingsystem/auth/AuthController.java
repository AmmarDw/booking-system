package com.ammar.bookingsystem.auth;

import com.ammar.bookingsystem.security.CurrentUser;
import com.ammar.bookingsystem.security.JwtService;
import com.ammar.bookingsystem.security.UserPrincipal;
import com.ammar.bookingsystem.user.Role;
import com.ammar.bookingsystem.user.User;
import com.ammar.bookingsystem.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        // FR-16: public self-registration is always CONSUMER — RegisterRequest has no role field.
        User user = new User(
                request.email(), passwordEncoder.encode(request.password()), request.fullName(), Role.CONSUMER);
        userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(
                new AuthResponse(user.getId(), token, user.getEmail(), user.getRole().name(), user.getFullName()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(
                new AuthResponse(user.getId(), token, user.getEmail(), user.getRole().name(), user.getFullName()));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me() {
        UserPrincipal principal = CurrentUser.get();
        User user = principal.getUser();
        return ResponseEntity.ok(
                new AuthResponse(user.getId(), null, user.getEmail(), user.getRole().name(), user.getFullName()));
    }
}
