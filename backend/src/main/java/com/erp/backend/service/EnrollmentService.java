package com.erp.backend.service;

import com.erp.backend.entity.Enrollment;
import com.erp.backend.entity.Student;
import com.erp.backend.entity.Course;
import com.erp.backend.repository.EnrollmentRepository;
import com.erp.backend.repository.StudentRepository;
import com.erp.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public Enrollment getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
    }

    public Enrollment createEnrollment(Enrollment enrollment) {
        // Validate student exists
        Student student = studentRepository.findByStudentId(enrollment.getStudent().getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Validate course exists
        Course course = courseRepository.findById(enrollment.getCourse().getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Check if student is already enrolled in this course
        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }
        
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDate.now());
        enrollment.setStatus(Enrollment.EnrollmentStatus.ENROLLED);
        
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment createEnrollment(Long studentId, Long courseId, String status) {
        // Validate student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        // Validate course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        // Check if student is already enrolled in this course
        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }
        
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDate.now());
        
        // Set status if provided, otherwise default to ENROLLED
        if (status != null && !status.trim().isEmpty()) {
            try {
                enrollment.setStatus(Enrollment.EnrollmentStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                enrollment.setStatus(Enrollment.EnrollmentStatus.ENROLLED);
            }
        } else {
            enrollment.setStatus(Enrollment.EnrollmentStatus.ENROLLED);
        }
        
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateEnrollment(Enrollment enrollment) {
        Enrollment existingEnrollment = getEnrollmentById(enrollment.getId());
        
        if (enrollment.getStudent() != null) {
            Student student = studentRepository.findByStudentId(enrollment.getStudent().getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            existingEnrollment.setStudent(student);
        }
        
        if (enrollment.getCourse() != null) {
            Course course = courseRepository.findById(enrollment.getCourse().getId())
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            existingEnrollment.setCourse(course);
        }
        
        if (enrollment.getEnrollmentDate() != null) {
            existingEnrollment.setEnrollmentDate(enrollment.getEnrollmentDate());
        }
        
        if (enrollment.getCompletionDate() != null) {
            existingEnrollment.setCompletionDate(enrollment.getCompletionDate());
        }
        
        if (enrollment.getGrade() != null) {
            existingEnrollment.setGrade(enrollment.getGrade());
        }
        
        if (enrollment.getScore() != null) {
            existingEnrollment.setScore(enrollment.getScore());
        }
        
        if (enrollment.getStatus() != null) {
            existingEnrollment.setStatus(enrollment.getStatus());
        }
        
        return enrollmentRepository.save(existingEnrollment);
    }

    public void deleteEnrollment(Long id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new RuntimeException("Enrollment not found with id: " + id);
        }
        enrollmentRepository.deleteById(id);
    }

    public List<Enrollment> getEnrollmentsByStudentId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return enrollmentRepository.findByStudent(student);
    }

    public List<Enrollment> getEnrollmentsByCourseId(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return enrollmentRepository.findByCourse(course);
    }

    public Enrollment updateGrade(Long enrollmentId, String grade, Double score) {
        Enrollment enrollment = getEnrollmentById(enrollmentId);
        enrollment.setGrade(grade);
        enrollment.setScore(score);
        
        // Update status to COMPLETED if grade is assigned
        if (grade != null && !grade.trim().isEmpty()) {
            enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
            enrollment.setCompletionDate(LocalDate.now());
        }
        
        return enrollmentRepository.save(enrollment);
    }

    public Enrollment updateStatus(Long enrollmentId, String status) {
        Enrollment enrollment = getEnrollmentById(enrollmentId);
        enrollment.setStatus(Enrollment.EnrollmentStatus.valueOf(status.toUpperCase()));
        
        // Set completion date if status is COMPLETED
        if (status.equalsIgnoreCase("COMPLETED")) {
            enrollment.setCompletionDate(LocalDate.now());
        }
        
        return enrollmentRepository.save(enrollment);
    }
}
