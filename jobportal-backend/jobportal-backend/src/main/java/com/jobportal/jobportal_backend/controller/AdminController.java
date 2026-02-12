package com.jobportal.jobportal_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.jobportal_backend.model.Admin;
import com.jobportal.jobportal_backend.model.Job;
import com.jobportal.jobportal_backend.repository.AdminRepository;
import com.jobportal.jobportal_backend.repository.JobRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JobRepository jobRepository;

    /* ================= ADMIN REGISTER ================= */

    @PostMapping("/register")
    public String register(@RequestBody Admin admin) {

        Admin existing =
            adminRepository.findByEmail(admin.getEmail());

        if (existing != null) {
            return "Admin already exists";
        }

        adminRepository.save(admin);

        return "Admin registered successfully";
    }

    /* ================= ADMIN LOGIN ================= */

    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {

        Admin dbAdmin =
            adminRepository.findByEmail(admin.getEmail());

        if (dbAdmin == null) {
            return "Admin not found";
        }

        if (!dbAdmin.getPassword().equals(admin.getPassword())) {
            return "Invalid password";
        }

        return "Login success";
    }

    /* ================= ADMIN GET JOBS ================= */

    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    /* ================= ADMIN DELETE JOB ================= */

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable String id) {

        Optional<Job> job =
                jobRepository.findById(id);

        if (job.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Job not found ❌");
        }

        jobRepository.deleteById(id);

        return ResponseEntity.ok("Job deleted ✅");
    }
}
