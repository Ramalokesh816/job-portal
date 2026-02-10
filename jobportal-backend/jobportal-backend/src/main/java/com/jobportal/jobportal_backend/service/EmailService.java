package com.jobportal.jobportal_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    // ================= VERIFY MAIL =================
    public void sendVerificationMail(String to, String link) {

        String body = """
                Dear Candidate,

                Please verify your job application by clicking below:
                """ + link + """

                Regards,
                JobConnect Team""";

        sendMail(to, "Verify Job Application", body);
    }


    // ================= THANK YOU =================
    public void sendThankYouMail(String to) {

        String body = """
                Dear Candidate,

                Your application has been verified successfully.
                We will contact you soon.

                Regards,
                HR Team""";

        sendMail(to, "Application Confirmed", body);
    }


    // ================= STATUS =================
    public void sendStatusMail(String to, String status) {

        String body = """
                Dear Candidate,

                Your application status: """ + status + """

                Regards,
                HR Team""";

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

                Date: """ + date + """
                Time: """ + time + """
                Location: """ + location + """

                Best of luck!

                HR Team""";

        sendMail(to, "Interview Invitation", body);
    }


    // ================= HR REPLY =================
    public void sendHRReplyMail(String to, String message) {

        String body = """
                Dear Candidate,

                """ + message + """

                Regards,
                HR Team""";

        sendMail(to, "Message from HR", body);
    }


    // ================= COMMON =================
    @SuppressWarnings({"UseSpecificCatch", "CallToPrintStackTrace"})
    private void sendMail(
            String to,
            String subject,
            String body) {

        try {

            SimpleMailMessage msg = new SimpleMailMessage();

            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);

            mailSender.send(msg);

            System.out.println("✅ Mail sent to: " + to);

        } catch (Exception e) {

            System.out.println("❌ Mail sending failed");
            e.printStackTrace();
        }
    }
}
