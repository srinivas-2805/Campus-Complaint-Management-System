package com.ccms.service;

import com.ccms.config.AppUrlProperties;
import com.ccms.dto.*;
import com.ccms.exception.ApiException;
import com.ccms.model.User;
import com.ccms.repository.UserRepository;
import com.ccms.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;

/**
 * Mirrors server/controllers/auth.controller.js.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AppUrlProperties appUrlProperties;

    public void register(RegisterRequest request) {
        // existingUser check (any role) - matches Node's first findOne({ email })
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        // Node also explicitly re-checks findOne({ email, role: "admin" }) and returns 403
        // with a different message; since the email is already known-unique from the check
        // above, that second branch is unreachable in the original code too. We keep the
        // same publicly-blocked behavior: nobody can self-register as admin.
        String role = (request.role() == null || request.role().isBlank()) ? "student" : request.role();
        if ("admin".equalsIgnoreCase(role)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Registration for admin accounts is not allowed.");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .build();

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid credentials");
        }

        String token = jwtService.generateToken(user.getId(), user.getRole());

        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .build();
    }

    public UserSummaryDto createFaculty(CreateFacultyRequest request) {
        if (isBlank(request.name()) || isBlank(request.email()) || isBlank(request.password())
                || isBlank(request.department())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "All fields are required");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role("faculty")
                .department(request.department())
                .build();

        User saved = userRepository.save(user);
        return UserSummaryDto.from(saved);
    }

    public List<UserSummaryDto> getAllFaculty() {
        return userRepository.findByRole("faculty").stream()
                .map(UserSummaryDto::from)
                .toList();
    }

    public void deleteFaculty(String id) {
        User faculty = userRepository.findByIdAndRole(id, "faculty")
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Faculty not found"));
        userRepository.delete(faculty);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (isBlank(request.email())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        String resetToken = generateResetToken();
        long resetTokenExpiry = Instant.now().toEpochMilli() + 15 * 60 * 1000L; // 15 minutes

        user.setResetToken(resetToken);
        user.setResetTokenExpiry(resetTokenExpiry);
        userRepository.save(user);

        String resetLink = appUrlProperties.frontendUrl() + "/reset-password/" + resetToken;

        String html = """
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                  <h3>Hello %s,</h3>
                  <p>You requested to reset your password. Please click the link below to reset it:</p>
                  <a href="%s" style="color:#E91E63; font-weight:bold;">Reset Password</a>
                  <p>This link will expire in 15 minutes.</p>
                  <p>If you did not request this, please ignore this email.</p>
                </div>
                """.formatted(user.getName(), resetLink);

        emailService.sendHtml(user.getEmail(), "Password Reset Request", html);
    }

    public void resetPassword(String token, ResetPasswordRequest request) {
        if (request.newPassword() == null || request.newPassword().length() < 6) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters long");
        }

        User user = userRepository.findByResetTokenAndResetTokenExpiryGreaterThan(token, Instant.now().toEpochMilli())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid or expired token"));

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private static String generateResetToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes); // matches crypto.randomBytes(32).toString("hex")
    }
}
