package com.erp.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        // Placeholder implementation — replace with real auth logic
        return ResponseEntity.ok(Map.of(
                "username", credentials.getOrDefault("username", "unknown"),
                "token", "placeholder-token"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> user) {
        // Placeholder implementation — create user and return created resource id
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", 1));
    }
}
