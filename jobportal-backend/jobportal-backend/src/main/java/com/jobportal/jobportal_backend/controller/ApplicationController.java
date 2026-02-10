package com.jobportal.jobportal_backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    private static final Logger log =
            LoggerFactory.getLogger(ApplicationController.class);

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


    /* ================= APPLY JOB ================= */

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> applyJob(

            @RequestParam String fullName,
            @RequestParam String experience,
            @RequestParam String skills,
            @RequestParam String jobTitle,
            @RequestParam String userEmail,
            @RequestParam MultipartFile resume
    ) {

        try {

            if (resume.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Resume required ❌");
            }


            /* ===== UPLOAD DIR ===== */

            Path uploadPath = Paths.get("uploads");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }


            /* ===== SAVE FILE ===== */

            String original =
                    resume.getOriginalFilename();

            String fileName =
                    System.currentTimeMillis() + "_" +
                    (original == null ? "resume.pdf" : original);

            Files.copy(
                    resume.getInputStream(),
                    uploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING
            );


            /* ===== SAVE APPLICATION ===== */

            Application app = new Application();

            app.setFullName(fullName);
            app.setExperience(experience);
            app.setSkills(skills);
            app.setJobTitle(jobTitle);
            app.setUserEmail(userEmail);
            app.setAppliedAt(new Date());
            app.setResume(fileName);
            app.setVerified(false);
            app.setStatus("PENDING");

            applicationRepository.save(app);


            /* ===== CREATE TOKEN ===== */

            String token = UUID.randomUUID().toString();

            EmailVerificationToken verify =
                    new EmailVerificationToken();

            verify.setEmail(userEmail);
            verify.setToken(token);
            verify.setVerified(false);
            verify.setCreatedAt(LocalDateTime.now());

            tokenRepository.save(verify);


            /* ===== SEND EMAIL ===== */

            try {

                String link =
                        "https://job-portal-4-ohxr.onrender.com" +
                        "/api/applications/verify?token=" +
                        token;

                emailService.sendVerificationMail(
                        userEmail, link);

                log.info("Verification mail sent to {}", userEmail);

            } catch (Exception e) {

                log.error("Mail failed", e);
            }


            return ResponseEntity.ok(
                    "Application submitted ✅ Please verify email"
            );

        } catch (IOException e) {

            log.error("Apply job failed", e);

            return ResponseEntity
                    .status(500)
                    .body("Server error ❌");
        }
    }


    /* ================= VERIFY ================= */

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(
            @RequestParam String token) {

        Optional<EmailVerificationToken> optional =
                tokenRepository.findByToken(token);

        if (optional.isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Invalid link ❌");
        }

        EmailVerificationToken verify =
                optional.get();

        if (verify.isVerified()) {

            return ResponseEntity.ok(
                    "Already verified ✅"
            );
        }


        /* ===== UPDATE TOKEN ===== */

        verify.setVerified(true);

        tokenRepository.save(verify);


        /* ===== UPDATE APPLICATION ===== */

        List<Application> apps =
                applicationRepository
                        .findByUserEmail(
                                verify.getEmail());

        if (!apps.isEmpty()) {

            Application latest =
                    apps.stream()
                        .max(Comparator.comparing(
                                Application::getAppliedAt))
                        .get();

            latest.setVerified(true);
            latest.setStatus("PENDING");

            applicationRepository.save(latest);
        }


        /* ===== THANK YOU MAIL ===== */

        try {

            emailService.sendThankYouMail(
                    verify.getEmail());

        } catch (Exception e) {

            log.error("Thank you mail failed", e);
        }


        return ResponseEntity.ok(
                "Application verified successfully ✅"
        );
    }


    /* ================= GET USER APPS ================= */

    @GetMapping("/user/{email}")
    public List<Application> getByUserEmail(
            @PathVariable String email) {

        return applicationRepository
                .findByUserEmail(email);
    }


    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(
            @PathVariable String id) {

        if (!applicationRepository.existsById(id)) {

            return ResponseEntity.badRequest()
                    .body("Not found ❌");
        }

        applicationRepository.deleteById(id);

        return ResponseEntity.ok("Deleted ✅");
    }


    /* ================= STATUS ================= */

    @PutMapping("/status/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestParam String status) {

        Optional<Application> optional =
                applicationRepository.findById(id);

        if (optional.isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Not found ❌");
        }

        Application app = optional.get();

        app.setStatus(status);

        applicationRepository.save(app);


        try {

            emailService.sendStatusMail(
                    app.getUserEmail(),
                    status);

        } catch (Exception e) {

            log.error("Status mail failed", e);
        }


        return ResponseEntity.ok("Status updated ✅");
    }


    /* ================= INTERVIEW ================= */

    @PostMapping("/interview/{id}")
    public ResponseEntity<?> sendInterview(

            @PathVariable String id,
            @RequestParam String date,
            @RequestParam String time,
            @RequestParam String location) {

        Optional<Application> optional =
                applicationRepository.findById(id);

        if (optional.isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Not found ❌");
        }

        Application app = optional.get();


        try {

            emailService.sendInterviewMail(
                    app.getUserEmail(),
                    date,
                    time,
                    location);

        } catch (Exception e) {

            log.error("Interview mail failed", e);
        }


        return ResponseEntity.ok("Interview mail sent ✅");
    }


    /* ================= HR REPLY ================= */

    @PostMapping("/reply/{id}")
    public ResponseEntity<?> sendHRReply(

            @PathVariable String id,
            @RequestParam String message) {

        Optional<Application> optional =
                applicationRepository.findById(id);

        if (optional.isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Not found ❌");
        }

        Application app = optional.get();


        try {

            emailService.sendHRReplyMail(
                    app.getUserEmail(),
                    message);

        } catch (Exception e) {

            log.error("HR reply mail failed", e);
        }


        return ResponseEntity.ok("Reply sent ✅");
    }
}
