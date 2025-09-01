package com.erp.backend.repository;

import com.erp.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    List<Course> findByDepartment(String department);
    List<Course> findByTitleContainingIgnoreCase(String title);
    List<Course> findByCredits(Integer credits);
    boolean existsByCode(String code);
}
