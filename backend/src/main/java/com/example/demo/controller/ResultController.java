package com.example.demo.controller;

import com.example.demo.model.Result;
import com.example.demo.service.ResultService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:5173")
public class ResultController {

    private final ResultService svc;

    public ResultController(ResultService svc) { this.svc = svc; }

    @GetMapping
    public List<Result> all() { return svc.findAll(); }

    @PostMapping
    public ResponseEntity<Result> create(@RequestParam Long enrollmentId, @RequestParam Double marks, @RequestParam String grade, @RequestParam(required = false) String remarks) {
        Result r = svc.create(enrollmentId, marks, grade, remarks);
        return ResponseEntity.status(HttpStatus.CREATED).body(r);
    }

    @PutMapping("/{id}")
    public Result update(@PathVariable Long id, @RequestParam Double marks, @RequestParam String grade, @RequestParam(required = false) String remarks) {
        return svc.update(id, marks, grade, remarks);
    }
}
