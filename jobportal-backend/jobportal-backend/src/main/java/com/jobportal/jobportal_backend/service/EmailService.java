package com.jobportal.jobportal_backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;


    // ================= VERIFY MAIL =================
    public void sendVerificationMail(String to, String link) {

        sendMail(
            to,
            "Verify Your Job Application",
            """
            Dear Candidate,

            Please verify your application:
            """ + link + """

            Regards,
            JobConnect Team"""
        );
    }


    // ================= THANK YOU =================
    public void sendThankYouMail(String to) {

        sendMail(
            to,
            "Application Confirmed",
            """
            Dear Candidate,

            Your application is verified.
            We will contact you soon.

            Regards,
            HR Team"""
        );
    }


    // ================= HR REPLY =================
    public void sendHRReplyMail(String to, String message) {

        sendMail(
            to,
            "Message from HR",
            """
            Dear Candidate,

            """ + message + """

            Regards,
            HR Team"""
        );
    }


    // ================= INTERVIEW =================
    public void sendInterviewMail(
            String to,
            String date,
            String time,
            String location) {

        sendMail(
            to,
            "Interview Invitation",
            """
            Dear Candidate,

            You are shortlisted for interview.

            Date: """ + date + """
            Time: """ + time + """
            Location: """ + location + """

            Best of luck!

            HR Team"""
        );
    }


    // ================= STATUS =================
    public void sendStatusMail(String to, String status) {

        sendMail(
            to,
            "Application Status Update",
            """
            Dear Candidate,

            Your application status: """ + status + """

            Regards,
            HR Team"""
        );
    }


    // ================= COMMON =================
    private void sendMail(
            String to,
            String subject,
            String body) {

        try {

            SimpleMailMessage msg =
                    new SimpleMailMessage();

            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);

            mailSender.send(msg);

            System.out.println("Mail sent to: " + to);

        } catch (org.springframework.mail.MailException | IllegalArgumentException e) {

            logger.error("Failed to send email to: " + to, e);
        }
    }
}
