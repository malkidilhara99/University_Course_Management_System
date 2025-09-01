package com.example.demo.repository;

import com.example.demo.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    Optional<Result> findByEnrollmentId(Long enrollmentId);
}
