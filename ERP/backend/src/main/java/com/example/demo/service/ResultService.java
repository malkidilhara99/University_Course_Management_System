package com.example.demo.service;

import com.example.demo.model.Result;
import com.example.demo.model.Enrollment;
import com.example.demo.repository.ResultRepository;
import com.example.demo.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {
    private final ResultRepository repo;
    private final EnrollmentRepository enrollmentRepo;

    public ResultService(ResultRepository repo, EnrollmentRepository enrollmentRepo) {
        this.repo = repo;
        this.enrollmentRepo = enrollmentRepo;
    }

    public List<Result> findAll() { return repo.findAll(); }

    public Result create(Long enrollmentId, Double marks, String grade, String remarks) {
        Enrollment e = enrollmentRepo.findById(enrollmentId).orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));
        Result r = new Result();
        r.setEnrollment(e);
        r.setMarks(marks);
        r.setGrade(grade);
        r.setRemarks(remarks);
        return repo.save(r);
    }

    public Result update(Long id, Double marks, String grade, String remarks) {
        Result r = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Result not found"));
        r.setMarks(marks); r.setGrade(grade); r.setRemarks(remarks);
        return repo.save(r);
    }
}
