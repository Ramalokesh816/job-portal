package com.jobportal.jobportal_backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
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

    private static final Logger logger = LoggerFactory.getLogger(ApplicationController.class);

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

            /* ===== CREATE UPLOAD FOLDER ===== */

            Path uploadPath = Paths.get("uploads");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }


            /* ===== SAVE FILE ===== */

            String fileName =
                    System.currentTimeMillis() +
                    "_" +
                    resume.getOriginalFilename();

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

            applicationRepository.save(app);


            /* ===== CREATE EMAIL TOKEN ===== */

            String token = UUID.randomUUID().toString();

            EmailVerificationToken verify =
                    new EmailVerificationToken();

            verify.setEmail(userEmail);
            verify.setToken(token);
            verify.setVerified(false);
            verify.setCreatedAt(LocalDateTime.now());

            tokenRepository.save(verify);


            /* ===== SEND EMAIL (OPTIONAL) ===== */

            try {

                String link =
                        "https://job-portal-4-ohxr.onrender.com" +
                        "/api/applications/verify?token=" +
                        token;

                emailService.sendVerificationMail(
                        userEmail, link);

            } catch (Exception e) {

                System.out.println("Mail error: " + e.getMessage());
            }


            return ResponseEntity.ok(
                    Map.of(
                        "message",
                        "Application submitted successfully ✅"
                    )
            );


} catch (IOException | RuntimeException e) {

    logger.error("Error while processing job application", e);

    return ResponseEntity.status(500)
            .body(Map.of(
                "message",
                "Server error ❌"
            ));
}

    }


    /* ================= VERIFY EMAIL ================= */

    @GetMapping("/verify")
public ResponseEntity<?> verifyEmail(
        @RequestParam String token) {

    Optional<EmailVerificationToken> optional =
            tokenRepository.findByToken(token);

    if (optional.isEmpty()) {

        return ResponseEntity.badRequest()
                .body("Invalid verification link ❌");
    }

    EmailVerificationToken verify =
            optional.get();


    // Already verified
    if (verify.isVerified()) {

        return ResponseEntity.ok(
                "Application already verified ✅"
        );
    }


    // Mark verified
    verify.setVerified(true);

    tokenRepository.save(verify);


    // Update latest application
    List<Application> apps =
        applicationRepository.findByUserEmail(
                verify.getEmail()
        );

    if (!apps.isEmpty()) {

        Application app =
                apps.get(apps.size() - 1);

        app.setVerified(true);
        app.setStatus("PENDING");


        applicationRepository.save(app);
    }


    // ✅ SEND THANK YOU MAIL
    emailService.sendThankYouMail(
            verify.getEmail()
    );


    // ✅ SHOW SUCCESS PAGE
    return ResponseEntity.ok(
        "<h2>✅ Application Confirmed</h2>" +
        "<p>Thank you for applying.</p>" +
        "<p>You will receive further updates via email.</p>"
    );
}


    /* ================= GET USER APPLICATIONS ================= */

    @GetMapping("/user/{email}")
    public List<Application> getByUserEmail(
            @PathVariable String email) {

        return applicationRepository
                .findByUserEmail(email);
    }


    /* ================= DELETE APPLICATION ================= */

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(
            @PathVariable String id) {

        if (!applicationRepository.existsById(id)) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message",
                        "Not found"
                    ));
        }

        applicationRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of(
                    "message",
                    "Deleted successfully ✅"
                ));
    }
    /* ================= Status Update ================= */
    @PutMapping("/status/{id}")
public ResponseEntity<?> updateStatus(
        @PathVariable String id,
        @RequestParam String status) {

    Optional<Application> optional =
            applicationRepository.findById(id);

    if (optional.isEmpty()) {

        return ResponseEntity.badRequest()
                .body("Application not found");
    }

    Application app = optional.get();

    app.setStatus(status);

    applicationRepository.save(app);

    // Send status mail
    emailService.sendStatusMail(
            app.getUserEmail(),
            status
    );

    return ResponseEntity.ok("Status updated");
}

/* ================= Interview ================= */
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
                .body("Application not found");
    }

    Application app = optional.get();

    emailService.sendInterviewMail(
            app.getUserEmail(),
            date,
            time,
            location
    );

    return ResponseEntity.ok("Interview mail sent");
}
/* ================= HR Reply ================= */

@PostMapping("/reply/{id}")
public ResponseEntity<?> sendHRReply(
        @PathVariable String id,
        @RequestParam String message) {

    Optional<Application> optional =
            applicationRepository.findById(id);

    if (optional.isEmpty()) {

        return ResponseEntity.badRequest()
                .body("Application not found");
    }

    Application app = optional.get();

    emailService.sendHRReplyMail(
            app.getUserEmail(),
            message
    );

    return ResponseEntity.ok("HR reply sent");
}


}
