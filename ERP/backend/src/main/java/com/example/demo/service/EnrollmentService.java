package com.example.demo.service;

import com.example.demo.model.Enrollment;
import com.example.demo.model.Student;
import com.example.demo.model.Course;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {
    private final EnrollmentRepository repo;
    private final StudentRepository studentRepo;
    private final CourseRepository courseRepo;

    public EnrollmentService(EnrollmentRepository repo, StudentRepository studentRepo, CourseRepository courseRepo) {
        this.repo = repo;
        this.studentRepo = studentRepo;
        this.courseRepo = courseRepo;
    }

    public List<Enrollment> findAll() { return repo.findAll(); }

    public Enrollment create(Long studentId, Long courseId, String semester, Double internalMarks, Double finalMarks) {
        if (repo.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new IllegalArgumentException("Student already enrolled in this course");
        }
        Student s = studentRepo.findById(studentId).orElseThrow(() -> new IllegalArgumentException("Student not found"));
        Course c = courseRepo.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Course not found"));
        Enrollment e = new Enrollment();
        e.setStudent(s);
        e.setCourse(c);
        e.setSemester(semester);
        e.setInternalMarks(internalMarks);
        e.setFinalMarks(finalMarks);
        return repo.save(e);
    }

    public void delete(Long id) { repo.deleteById(id); }
}
