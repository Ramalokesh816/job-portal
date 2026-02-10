package com.jobportal.jobportal_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.jobportal_backend.service.EmailService;

@RestController
public class TestMailController {

    private final EmailService emailService;

    public TestMailController(EmailService emailService) {
        this.emailService = emailService;
    }


    @GetMapping("/api/test/mail")
    public String testMail() {

        emailService.sendThankYouMail(
                "jramalokesh04@gmail.com"
        );

        return "Mail Sent ✅";
    }
}
