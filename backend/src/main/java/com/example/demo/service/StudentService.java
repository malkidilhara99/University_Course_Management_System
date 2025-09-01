package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public List<Student> findAll() {
        return repo.findAll();
    }

    public Student create(Student s) {
        // simple duplicate guard
        if (repo.existsByIndexNo(s.getIndexNo())) {
            throw new IllegalArgumentException("Index number already exists");
        }
        return repo.save(s);
    }

    public Student update(Long id, Student s) {
        s.setId(id);
        return repo.save(s);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
