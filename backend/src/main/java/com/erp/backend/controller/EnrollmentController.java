package com.erp.backend.controller;

import com.erp.backend.entity.Enrollment;
import com.erp.backend.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import jakarta.validation.Valid;
import java.util.List;
import com.erp.backend.dto.EnrollmentRequest;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<Enrollment>> getAllEnrollments(Authentication authentication) {
        try {
            List<Enrollment> enrollments = enrollmentService.getAllEnrollmentsBasedOnRole(authentication);
            return ResponseEntity.ok(enrollments);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enrollment> getEnrollmentById(@PathVariable Long id, Authentication authentication) {
        try {
            Enrollment enrollment = enrollmentService.getEnrollmentByIdBasedOnRole(id, authentication);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @PostMapping("/student-enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Enrollment> enrollStudentInCourse(@Valid @RequestBody EnrollmentRequest request, Authentication authentication) {
        try {
            Enrollment createdEnrollment = enrollmentService.createStudentSelfEnrollment(request, authentication);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<Enrollment> createEnrollment(@Valid @RequestBody EnrollmentCreateRequest request) {
        try {
            Enrollment createdEnrollment = enrollmentService.createEnrollment(request.getStudentId(), request.getCourseId(), request.getStatus());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<Enrollment> updateEnrollment(@PathVariable Long id, @Valid @RequestBody Enrollment enrollment) {
        try {
            enrollment.setId(id);
            Enrollment updatedEnrollment = enrollmentService.updateEnrollment(enrollment);
            return ResponseEntity.ok(updatedEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        try {
            enrollmentService.deleteEnrollment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByStudent(@PathVariable String studentId, Authentication authentication) {
        try {
            List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudentBasedOnRole(studentId, authentication);
            return ResponseEntity.ok(enrollments);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByCourse(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByCourseId(courseId);
        return ResponseEntity.ok(enrollments);
    }

    @PutMapping("/{id}/grade")
    public ResponseEntity<Enrollment> updateGrade(@PathVariable Long id, @RequestBody GradeUpdateRequest request) {
        try {
            Enrollment updatedEnrollment = enrollmentService.updateGrade(id, request.getGrade(), request.getScore());
            return ResponseEntity.ok(updatedEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Enrollment> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            Enrollment updatedEnrollment = enrollmentService.updateStatus(id, request.getStatus());
            return ResponseEntity.ok(updatedEnrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DTO classes for enrollment creation
    public static class EnrollmentCreateRequest {
        private Long studentId;
        private Long courseId;
        private String status;

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    // DTO classes for grade and status updates
    public static class GradeUpdateRequest {
        private String grade;
        private Double score;

        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }
        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }
    }

    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
