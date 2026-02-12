package com.jobportal.jobportal_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.jobportal_backend.model.Job;
import com.jobportal.jobportal_backend.repository.JobRepository;

@RestController
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    /* ================= PUBLIC JOB ROUTES ================= */

    @GetMapping("/api/jobs")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping("/api/jobs")
    public Job addJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }


    /* ================= ADMIN JOB ROUTES ================= */

    @GetMapping("/api/admin/jobs")
    public List<Job> getAllJobsForAdmin() {
        return jobRepository.findAll();
    }

    @DeleteMapping("/api/admin/jobs/{id}")
    public String deleteJob(@PathVariable String id) {

        Optional<Job> job = jobRepository.findById(id);

        if (job.isEmpty()) {
            return "Job not found ❌";
        }

        jobRepository.deleteById(id);

        return "Job deleted successfully ✅";
    }
}
