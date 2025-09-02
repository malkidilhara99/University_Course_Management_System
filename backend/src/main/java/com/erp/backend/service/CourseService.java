package com.erp.backend.service;

import com.erp.backend.entity.Course;
import com.erp.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    // Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    // Get course by ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }
    
    // Get course by code
    public Optional<Course> getCourseByCode(String code) {
        return courseRepository.findByCode(code);
    }
    
    // Get courses by department
    public List<Course> getCoursesByDepartment(String department) {
        return courseRepository.findByDepartment(department);
    }
    
    // Search courses by title
    public List<Course> searchCoursesByTitle(String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title);
    }
    
    // Get courses by credits
    public List<Course> getCoursesByCredits(Integer credits) {
        return courseRepository.findByCredits(credits);
    }
    
    // Create new course
    public Course createCourse(Course course) {
        // Check if course code already exists
        if (courseRepository.existsByCode(course.getCode())) {
            throw new RuntimeException("Course with code " + course.getCode() + " already exists");
        }
        // Set creation date
        if (course.getCreatedDate() == null) {
            course.setCreatedDate(LocalDate.now());
        }
        return courseRepository.save(course);
    }
    
    // Update existing course
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        // Check if new code conflicts with existing courses (excluding current course)
        if (!course.getCode().equals(courseDetails.getCode()) && 
            courseRepository.existsByCode(courseDetails.getCode())) {
            throw new RuntimeException("Course with code " + courseDetails.getCode() + " already exists");
        }
        
        course.setCode(courseDetails.getCode());
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setCredits(courseDetails.getCredits());
        course.setDepartment(courseDetails.getDepartment());
        
        return courseRepository.save(course);
    }
    
    // Delete course
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        courseRepository.delete(course);
    }
    
    // Check if course exists
    public boolean courseExists(Long id) {
        return courseRepository.existsById(id);
    }
    
    // Check if course code exists
    public boolean courseCodeExists(String code) {
        return courseRepository.existsByCode(code);
    }
}
