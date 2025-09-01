package com.example.demo.controller;

import com.example.demo.model.Enrollment;
import com.example.demo.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {

    private final EnrollmentService svc;

    public EnrollmentController(EnrollmentService svc) { this.svc = svc; }

    @GetMapping
    public List<Enrollment> all() { return svc.findAll(); }

    @PostMapping
    public ResponseEntity<Enrollment> create(
            @RequestParam Long studentId,
            @RequestParam Long courseId,
            @RequestParam String semester,
            @RequestParam(required = false) Double internalMarks,
            @RequestParam(required = false) Double finalMarks
    ) {
        Enrollment e = svc.create(studentId, courseId, semester, internalMarks, finalMarks);
        return ResponseEntity.status(HttpStatus.CREATED).body(e);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        svc.delete(id);
        return ResponseEntity.noContent().build();
    }
}
