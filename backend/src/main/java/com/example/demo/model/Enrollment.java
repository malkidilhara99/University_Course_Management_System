package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Student student;

    @ManyToOne(optional = false)
    private Course course;

    private String semester; // e.g., 2025S

    private Double internalMarks;
    private Double finalMarks;

    private Instant enrolledAt = Instant.now();
}
