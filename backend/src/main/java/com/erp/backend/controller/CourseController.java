package com.erp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listCourses() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("id", id));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createCourse(@RequestBody Map<String, Object> course) {
        return ResponseEntity.status(201).body(Map.of("id", 1));
    }
}
