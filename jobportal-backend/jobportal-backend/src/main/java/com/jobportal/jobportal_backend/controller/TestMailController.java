package com.jobportal.jobportal_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.jobportal_backend.service.EmailService;

@RestController
@RequestMapping("/api/test")
public class TestMailController {

    @Autowired
    private EmailService emailService;


    @PostMapping("/mail")
    public ResponseEntity<?> testMail(@RequestBody Map<String,String> body) {

        String email = body.get("email");

        emailService.sendVerificationMail(
                email,
                "https://example.com/test"
        );

        return ResponseEntity.ok("✅ Test mail sent");
    }
}
