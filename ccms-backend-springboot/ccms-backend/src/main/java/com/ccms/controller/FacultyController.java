package com.ccms.controller;

import com.ccms.dto.UserSummaryDto;
import com.ccms.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Mirrors server/routes/facultyRoutes.js.
 */
@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<Map<String, Object>> dashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(Map.of(
                "message", "Welcome Faculty",
                "user", UserSummaryDto.from(principal.getUser())
        ));
    }
}
