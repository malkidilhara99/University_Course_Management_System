package com.erp.backend.repository;

import com.erp.backend.entity.Enrollment;
import com.erp.backend.entity.Student;
import com.erp.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByStudentAndCourse(Student student, Course course);
    List<Enrollment> findByStudent(Student student);
    List<Enrollment> findByCourse(Course course);
}
