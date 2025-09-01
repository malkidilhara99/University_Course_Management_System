package com.erp.backend.service;

import com.erp.backend.entity.User;
import com.erp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.erp.backend.entity.Student;
import com.erp.backend.repository.StudentRepository;
import com.erp.backend.controller.AuthController;

import java.util.Collection;
import java.util.List;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private StudentRepository studentRepository;

    public User save(User user) { return userRepository.save(user); }

    public User findByUsernameOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUsernameOrThrow(username);
        Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }

    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public User createUser(AuthController.RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encode the password
        user.setRole(request.getRole());
        
        // Save the user first
        User savedUser = userRepository.save(user);
        
        // If it's a student, create student profile
        if ("STUDENT".equals(request.getRole())) {
            createStudentProfile(request, savedUser);
        }
        
        return savedUser;
    }

    private void createStudentProfile(AuthController.RegisterRequest request, User user) {
        // Create a Student entity and link it to the User
        // This ensures the student can be found in the system
        try {
            Student student = new Student();
            student.setStudentId(request.getStudentId());
            student.setFirstName(request.getFirstName());
            student.setLastName(request.getLastName());
            student.setEmail(request.getEmail());
            student.setPhone(request.getPhone());
            student.setMajor(request.getMajor());
            student.setYearLevel(request.getYearLevel());
            student.setAddress(request.getAddress());
            
            // Save the student
            studentRepository.save(student);
        } catch (Exception e) {
            // Log the error but don't fail the user creation
            System.err.println("Failed to create student profile: " + e.getMessage());
        }
    }
 }
