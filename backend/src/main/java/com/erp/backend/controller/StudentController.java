package com.erp.backend.controller;

import com.erp.backend.entity.Student;
import com.erp.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    // Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }
    
    // Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(student -> ResponseEntity.ok(student))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Get student by student ID
    @GetMapping("/studentId/{studentId}")
    public ResponseEntity<Student> getStudentByStudentId(@PathVariable String studentId) {
        return studentService.getStudentByStudentId(studentId)
                .map(student -> ResponseEntity.ok(student))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Get student by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        return studentService.getStudentByEmail(email)
                .map(student -> ResponseEntity.ok(student))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Get students by major
    @GetMapping("/major/{major}")
    public ResponseEntity<List<Student>> getStudentsByMajor(@PathVariable String major) {
        List<Student> students = studentService.getStudentsByMajor(major);
        return ResponseEntity.ok(students);
    }
    
    // Get students by year level
    @GetMapping("/year/{yearLevel}")
    public ResponseEntity<List<Student>> getStudentsByYearLevel(@PathVariable Integer yearLevel) {
        List<Student> students = studentService.getStudentsByYearLevel(yearLevel);
        return ResponseEntity.ok(students);
    }
    
    // Search students by name
    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam String name) {
        List<Student> students = studentService.searchStudentsByName(name);
        return ResponseEntity.ok(students);
    }
    
    // Create new student
    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        try {
            Student createdStudent = studentService.createStudent(student);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Update existing student
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @Valid @RequestBody Student studentDetails) {
        try {
            Student updatedStudent = studentService.updateStudent(id, studentDetails);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Check if student exists
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> studentExists(@PathVariable Long id) {
        boolean exists = studentService.studentExists(id);
        return ResponseEntity.ok(exists);
    }
    
    // Check if student ID exists
    @GetMapping("/studentId/{studentId}/exists")
    public ResponseEntity<Boolean> studentIdExists(@PathVariable String studentId) {
        boolean exists = studentService.studentIdExists(studentId);
        return ResponseEntity.ok(exists);
    }
    
    // Check if email exists
    @GetMapping("/email/{email}/exists")
    public ResponseEntity<Boolean> emailExists(@PathVariable String email) {
        boolean exists = studentService.emailExists(email);
        return ResponseEntity.ok(exists);
    }
}
