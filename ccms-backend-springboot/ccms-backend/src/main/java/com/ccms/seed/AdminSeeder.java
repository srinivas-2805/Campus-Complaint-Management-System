package com.ccms.seed;

import com.ccms.config.SeedProperties;
import com.ccms.model.User;
import com.ccms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Replaces server/seeder/adminSeeder.js. Unlike the original standalone script
 * (run manually with `node seeder/adminSeeder.js` then exit), this runs automatically
 * once on every application startup and is idempotent: existing admin emails are skipped.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SeedProperties seedProperties;

    @Override
    public void run(String... args) {
        if (seedProperties.admins() == null) {
            return;
        }

        for (SeedProperties.AdminSeed admin : seedProperties.admins()) {
            if (userRepository.existsByEmail(admin.email())) {
                log.info("Admin already exists: {}", admin.email());
                continue;
            }

            User user = User.builder()
                    .name(admin.name())
                    .email(admin.email())
                    .password(passwordEncoder.encode(admin.password()))
                    .role("admin")
                    .build();

            userRepository.save(user);
            log.info("Admin added: {}", admin.email());
        }
    }
}
