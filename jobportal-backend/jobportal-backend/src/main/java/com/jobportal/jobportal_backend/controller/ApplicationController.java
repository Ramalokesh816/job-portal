package com.jobportal.jobportal_backend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal.jobportal_backend.model.Application;
import com.jobportal.jobportal_backend.model.EmailVerificationToken;
import com.jobportal.jobportal_backend.repository.ApplicationRepository;
import com.jobportal.jobportal_backend.repository.EmailTokenRepository;
import com.jobportal.jobportal_backend.service.EmailService;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final EmailTokenRepository tokenRepository;
    private final EmailService emailService;


    public ApplicationController(
            ApplicationRepository applicationRepository,
            EmailTokenRepository tokenRepository,
            EmailService emailService) {

        this.applicationRepository = applicationRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }


    /* ================= APPLY ================= */

    @PostMapping(
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> apply(

        @RequestParam String fullName,
        @RequestParam String experience,
        @RequestParam String skills,
        @RequestParam String jobTitle,
        @RequestParam String userEmail,
        @RequestParam MultipartFile resume

    ) throws Exception {

        Path upload =
                Paths.get("uploads");

        if (!Files.exists(upload)) {

            Files.createDirectories(upload);
        }

        String fileName =
            System.currentTimeMillis() +
            "_" +
            resume.getOriginalFilename();

        Files.copy(
            resume.getInputStream(),
            upload.resolve(fileName),
            StandardCopyOption.REPLACE_EXISTING
        );


        Application app = new Application();

        app.setFullName(fullName);
        app.setExperience(experience);
        app.setSkills(skills);
        app.setJobTitle(jobTitle);
        app.setUserEmail(userEmail);
        app.setAppliedAt(new Date());
        app.setResume(fileName);
        app.setVerified(false);

        Application saved =
                applicationRepository.save(app);


        String token =
                UUID.randomUUID().toString();

        EmailVerificationToken verify =
                new EmailVerificationToken();

        verify.setEmail(userEmail);
        verify.setToken(token);
        verify.setVerified(false);
        verify.setCreatedAt(LocalDateTime.now());

        tokenRepository.save(verify);


        String link =
            "https://job-portal-4-ohxr.onrender.com" +
            "/api/applications/verify?token=" +
            token;

        emailService.sendVerificationMail(
                userEmail, link);


        return ResponseEntity.ok(saved);
    }


    /* ================= GET ================= */

    @GetMapping("/user/{email}")
    public List<Application> getUserApps(
            @PathVariable String email) {

        return applicationRepository
                .findByUserEmail(email);
    }


    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable String id) {

        if (!applicationRepository
                .existsById(id)) {

            return ResponseEntity.badRequest()
                    .body("Not found");
        }

        applicationRepository.deleteById(id);

        return ResponseEntity.ok("Deleted");
    }
}
