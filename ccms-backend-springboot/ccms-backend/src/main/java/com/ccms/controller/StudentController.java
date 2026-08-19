package com.ccms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Mirrors server/routes/studentRoutes.js + controllers/student.controller.js.
 * These were stub endpoints with no auth middleware in the original app.
 */
@RestController
@RequestMapping("/api/student")
public class StudentController {

    @GetMapping
    public ResponseEntity<Map<String, String>> getStudents() {
        return ResponseEntity.ok(Map.of("message", "Get students working"));
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createStudent() {
        return ResponseEntity.ok(Map.of("message", "Create student working"));
    }
}
