package com.erp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listStudents() {
        // Placeholder empty list
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("id", id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createStudent(@RequestBody Map<String, Object> student) {
        return ResponseEntity.status(201).body(Map.of("id", 1));
    }
}
