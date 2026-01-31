package com.jobportal.jobportal_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;   // ✅ IMPORTANT
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.jobportal_backend.model.Application;
import com.jobportal.jobportal_backend.repository.ApplicationRepository;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;

    public ApplicationController(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }


    // Save application
    @PostMapping
    public Application applyJob(@RequestBody Application application) {

        System.out.println("APPLICATION = " + application.getUserEmail());
        System.out.println("NAME = " + application.getFullName());

        return applicationRepository.save(application);
    }


    // Get applications by user email
    @GetMapping("/user/{email}")
    public List<Application> getByUser(@PathVariable String email) {
        return applicationRepository.findByUserEmail(email);
    }


    // Delete application
    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable String id) {
        applicationRepository.deleteById(id);
    }
}
