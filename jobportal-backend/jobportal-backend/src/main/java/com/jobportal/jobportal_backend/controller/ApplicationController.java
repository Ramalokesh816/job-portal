package com.jobportal.jobportal_backend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.Date;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

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


    /* ================= APPLY JOB (WITH RESUME) ================= */

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Application applyJob(

            @RequestParam("fullName") String fullName,
            @RequestParam("experience") String experience,
            @RequestParam("skills") String skills,
            @RequestParam("jobTitle") String jobTitle,
            @RequestParam("userEmail") String userEmail,
            @RequestParam("appliedAt") String appliedAt,
            @RequestParam("resume") MultipartFile resume

    ) throws Exception {

        /* ===== CREATE UPLOAD FOLDER ===== */

        Path uploadPath = Paths.get("uploads");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }


        /* ===== SAVE FILE ===== */

        String fileName =
                System.currentTimeMillis() + "_" +
                resume.getOriginalFilename();

        Files.copy(
                resume.getInputStream(),
                uploadPath.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING
        );


        /* ===== CREATE APPLICATION OBJECT ===== */

        Application app = new Application();

        app.setFullName(fullName);
        app.setExperience(experience);
        app.setSkills(skills);
        app.setJobTitle(jobTitle);
        app.setUserEmail(userEmail);
        app.setAppliedAt(new Date());
        app.setResume(fileName);


        /* ===== SAVE TO MONGODB ===== */

        return applicationRepository.save(app);
    }


    /* ================= GET USER APPLICATIONS ================= */

    @GetMapping("/user/{email}")
    public List<Application> getByUserEmail(
            @PathVariable String email
    ) {

        return applicationRepository.findByUserEmail(email);
    }


    /* ================= DELETE APPLICATION ================= */

    @DeleteMapping("/{id}")
    public void deleteApplication(
            @PathVariable String id
    ) {

        applicationRepository.deleteById(id);
    }

}
