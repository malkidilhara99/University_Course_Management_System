package com.erp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> enroll(@RequestBody Map<String, Object> body) {
        // Expect keys: studentId, courseId
        return ResponseEntity.status(201).body(Map.of("enrollmentId", 1));
    }
}
