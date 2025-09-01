package com.erp.backend.controller;

import com.erp.backend.config.JwtService;
import com.erp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
        var user = userService.findByUsernameOrThrow(request.getUsername());
        var userDetails = userService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails, Map.of("role", user.getRole()));
        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", user.getRole()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Check if username already exists
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
            }

            // Create new user
            var user = userService.createUser(request);
            
            return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "username", user.getUsername(),
                "role", user.getRole()
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", "Registration failed: " + ex.getMessage()));
        }
    }

    public static class LoginRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String role;
        private String phone;
        private String dateOfBirth;
        private String address;
        private String studentId;
        private String major;
        private Integer yearLevel;
        private String department;
        private String bio;

        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        
        public String getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
        
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        
        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
        
        public String getMajor() { return major; }
        public void setMajor(String major) { this.major = major; }
        
        public Integer getYearLevel() { return yearLevel; }
        public void setYearLevel(Integer yearLevel) { this.yearLevel = yearLevel; }
        
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        
        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }
    }
}
