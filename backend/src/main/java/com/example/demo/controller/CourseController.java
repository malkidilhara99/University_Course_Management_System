package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.repository.CourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final CourseRepository repo;

    public CourseController(CourseRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Course> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course c) {
        Course saved = repo.save(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable Long id, @RequestBody Course c) {
        c.setId(id);
        return repo.save(c);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

