package com.jobportal.jobportal_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.jobportal_backend.model.Employer;
import com.jobportal.jobportal_backend.repository.EmployerRepository;

@RestController
@RequestMapping("/api/employers")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployerController {

    @Autowired
    private EmployerRepository employerRepository;

    @GetMapping
    public List<Employer> getEmployers() {
        return employerRepository.findAll();
    }

    @PostMapping
    public Employer addEmployer(@RequestBody Employer employer) {
        return employerRepository.save(employer);
    }
}
