package com.erp.backend.repository;

import com.erp.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentId(String studentId);
    Optional<Student> findByEmail(String email);
    List<Student> findByMajor(String major);
    List<Student> findByYearLevel(Integer yearLevel);
    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    boolean existsByStudentId(String studentId);
    boolean existsByEmail(String email);
}
