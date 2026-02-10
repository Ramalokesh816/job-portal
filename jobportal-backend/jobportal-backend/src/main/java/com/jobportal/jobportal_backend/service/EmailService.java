package com.jobportal.jobportal_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    // ================= COMMON METHOD =================

    @SuppressWarnings({"UseSpecificCatch", "CallToPrintStackTrace"})
    private void sendMail(String to, String subject, String body) {

        try {

            SimpleMailMessage mail = new SimpleMailMessage();

            mail.setFrom("jramalokesh04@gmail.com"); // Verified in Brevo
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(body);

            mailSender.send(mail);

            System.out.println("✅ Mail sent to: " + to);

        } catch (Exception e) {

            System.out.println("❌ Mail failed");
            e.printStackTrace();
        }
    }


    // ================= VERIFY =================

    public void sendVerificationMail(String to, String link) {

        String body = """
                Dear Candidate,

                Please verify your job application:

                %s

                Regards,
                JobConnect Team
                """.formatted(link);

        sendMail(to, "Verify Job Application", body);
    }


    // ================= THANK YOU =================

    public void sendThankYouMail(String to) {

        String body = """
                Dear Candidate,

                Your application has been verified successfully.
                We will contact you soon.

                Regards,
                HR Team
                """;

        sendMail(to, "Application Confirmed", body);
    }


    // ================= STATUS =================

    public void sendStatusMail(String to, String status) {

        String body = """
                Dear Candidate,

                Your application status: %s

                Regards,
                HR Team
                """.formatted(status);

        sendMail(to, "Application Status Update", body);
    }


    // ================= INTERVIEW =================

    public void sendInterviewMail(
            String to,
            String date,
            String time,
            String location) {

        String body = """
                Dear Candidate,

                You are shortlisted for interview.

                Date: %s
                Time: %s
                Location: %s

                Best of luck!

                HR Team
                """.formatted(date, time, location);

        sendMail(to, "Interview Invitation", body);
    }


    // ================= HR REPLY =================

    public void sendHRReplyMail(String to, String message) {

        String body = """
                Dear Candidate,

                %s

                Regards,
                HR Team
                """.formatted(message);

        sendMail(to, "Message from HR", body);
    }
}
