package com.erp.backend.controller;

import com.erp.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        try {
            Map<String, Object> stats = dashboardService.getDashboardStats(authentication);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity(Authentication authentication) {
        try {
            List<Map<String, Object>> activities = dashboardService.getRecentActivity(authentication);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/enrollment-stats")
    public ResponseEntity<Map<String, Object>> getEnrollmentStats(Authentication authentication) {
        try {
            Map<String, Object> enrollmentStats = dashboardService.getEnrollmentStats(authentication);
            return ResponseEntity.ok(enrollmentStats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/courses-by-department")
    public ResponseEntity<List<Map<String, Object>>> getCoursesByDepartment(Authentication authentication) {
        try {
            List<Map<String, Object>> coursesByDept = dashboardService.getCoursesByDepartment(authentication);
            return ResponseEntity.ok(coursesByDept);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/performance-metrics")
    public ResponseEntity<Map<String, Object>> getPerformanceMetrics(Authentication authentication) {
        try {
            Map<String, Object> metrics = dashboardService.getPerformanceMetrics(authentication);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
