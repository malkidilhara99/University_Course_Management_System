package com.erp.backend.service;

import com.erp.backend.entity.Student;
import com.erp.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    // Get student by ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }
    
    // Get student by student ID
    public Optional<Student> getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId);
    }
    
    // Get student by email
    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }
    
    // Get students by major
    public List<Student> getStudentsByMajor(String major) {
        return studentRepository.findByMajor(major);
    }
    
    // Get students by year level
    public List<Student> getStudentsByYearLevel(Integer yearLevel) {
        return studentRepository.findByYearLevel(yearLevel);
    }
    
    // Search students by name
    public List<Student> searchStudentsByName(String name) {
        return studentRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }
    
    // Create new student
    public Student createStudent(Student student) {
        // Check if student ID already exists
        if (studentRepository.existsByStudentId(student.getStudentId())) {
            throw new RuntimeException("Student with ID " + student.getStudentId() + " already exists");
        }
        
        // Check if email already exists
        if (student.getEmail() != null && studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Student with email " + student.getEmail() + " already exists");
        }
        
        return studentRepository.save(student);
    }
    
    // Update existing student
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        
        // Check if new student ID conflicts with existing students (excluding current student)
        if (!student.getStudentId().equals(studentDetails.getStudentId()) && 
            studentRepository.existsByStudentId(studentDetails.getStudentId())) {
            throw new RuntimeException("Student with ID " + studentDetails.getStudentId() + " already exists");
        }
        
        // Check if new email conflicts with existing students (excluding current student)
        if (studentDetails.getEmail() != null && 
            !studentDetails.getEmail().equals(student.getEmail()) && 
            studentRepository.existsByEmail(studentDetails.getEmail())) {
            throw new RuntimeException("Student with email " + studentDetails.getEmail() + " already exists");
        }
        
        student.setStudentId(studentDetails.getStudentId());
        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());
        student.setPhone(studentDetails.getPhone());
        student.setDateOfBirth(studentDetails.getDateOfBirth());
        student.setAddress(studentDetails.getAddress());
        student.setMajor(studentDetails.getMajor());
        student.setYearLevel(studentDetails.getYearLevel());
        
        return studentRepository.save(student);
    }
    
    // Delete student
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        studentRepository.delete(student);
    }
    
    // Check if student exists
    public boolean studentExists(Long id) {
        return studentRepository.existsById(id);
    }
    
    // Check if student ID exists
    public boolean studentIdExists(String studentId) {
        return studentRepository.existsByStudentId(studentId);
    }
    
    // Check if email exists
    public boolean emailExists(String email) {
        return studentRepository.existsByEmail(email);
    }
}
