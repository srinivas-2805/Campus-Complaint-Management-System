package com.ccms.controller;

import com.ccms.dto.*;
import com.ccms.security.UserPrincipal;
import com.ccms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Mirrors server/routes/authRoutes.js.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // Admin-only route to create faculty
    @PostMapping("/faculty")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createFaculty(@RequestBody CreateFacultyRequest request) {
        UserSummaryDto faculty = authService.createFaculty(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Faculty created successfully", "user", faculty));
    }

    @GetMapping("/faculty")
    public ResponseEntity<List<UserSummaryDto>> getAllFaculty(@AuthenticationPrincipal UserPrincipal principal) {
        // Original Node code re-checks req.user.role === "admin" inside the controller
        // even though the route itself has no role restriction; preserved here too.
        if (!"admin".equals(principal.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(authService.getAllFaculty());
    }

    @DeleteMapping("/faculty/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteFaculty(@PathVariable String id) {
        authService.deleteFaculty(id);
        return ResponseEntity.ok(Map.of("message", "Faculty removed successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset email sent successfully!"));
    }

    @PutMapping("/reset-password/{token}")
    public ResponseEntity<Map<String, String>> resetPassword(@PathVariable String token,
                                                               @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(token, request);
        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }
}
