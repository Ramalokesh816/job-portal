package com.jobportal.jobportal_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    public void sendVerificationMail(
            String to,
            String link) {

        SimpleMailMessage msg =
                new SimpleMailMessage();

        msg.setTo(to);
        msg.setSubject("Verify Job Application");
        msg.setText(
            "Click this link to verify:\n" + link
        );

        mailSender.send(msg);
    }
}
