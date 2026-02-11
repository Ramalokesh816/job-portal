package com.jobportal.jobportal_backend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class EmailService {

    @Value("${brevo.api.key}")
    private String apiKey;

    private final HttpClient client = HttpClient.newHttpClient();

    private final ObjectMapper mapper = new ObjectMapper();


    // ================= COMMON SEND =================

    @SuppressWarnings({"UseSpecificCatch", "CallToPrintStackTrace"})
    private void sendMail(String to, String subject, String content) {

        try {

            ObjectNode root = mapper.createObjectNode();

            // Sender (MUST be verified in Brevo)
            ObjectNode sender = root.putObject("sender");
            sender.put("name", "JobConnect");
            sender.put("email", "jramalokesh04@gmail.com");

            // Receiver
            ObjectNode toNode = root.putArray("to")
                    .addObject();

            toNode.put("email", to);

            // Mail data
            root.put("subject", subject);
            root.put("htmlContent",
                    "<pre style='font-family:Arial'>" + content + "</pre>");

            String json = mapper.writeValueAsString(root);


            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://api.brevo.com/v3/smtp/email"))
                    .header("Content-Type", "application/json")
                    .header("api-key", apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();


            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());


            if (response.statusCode() == 201) {

                System.out.println("✅ Mail sent to: " + to);

            } else {

                System.out.println("❌ Mail failed: " + response.body());
            }

        } catch (Exception e) {

            System.out.println("❌ Email Error");
            e.printStackTrace();
        }
    }


    // ================= VERIFY =================

    public void sendVerificationMail(String to, String link) {

        String body = """
                Dear Candidate,

                Please verify your application:

                %s

                Regards,
                JobConnect Team
                """.formatted(link);

        sendMail(to, "Verify Job Application", body);
    }


    // ================= THANK YOU =================

    public void sendThankYouMail(String to, String name, String jobTitle, String company) {

    String body = """
            Dear %s,

            Thank you for applying for the position of %s at %s.

            We have successfully received your application and our recruitment team is currently reviewing your profile.

            If your qualifications match our requirements, we will contact you for the next steps.

            In the meantime, feel free to explore more opportunities on JobConnect.

            Best Wishes,
            JobConnect Hiring Team
            support@jobconnect.com
            www.jobconnect.com
            """.formatted(name, jobTitle, company);

    sendMail(to, "Application Successfully Submitted – JobConnect", body);
}


    // ================= STATUS =================

    
    public void sendStatusMail(String to, String name, String jobTitle, String company, String status) {

    String body = """
            Dear %s,

            We would like to inform you that the status of your application for the position of %s at %s has been updated.

            Current Application Status: %s

            Our recruitment team will keep you informed about further updates.

            If you have any questions, feel free to contact us at support@jobconnect.com.

            Thank you for choosing JobConnect.

            Best Regards,
            JobConnect Hiring Team
            www.jobconnect.com
            """.formatted(name, jobTitle, company, status);

    sendMail(to, "Application Status Update – JobConnect", body);
}



    // ================= INTERVIEW =================

    public void sendInterviewMail(
        String to,
        String name,
        String jobTitle,
        String company,
        String date,
        String time,
        String location) {

    String body = """
            Dear %s,

            Congratulations! You have been shortlisted for the interview round for the position of %s at %s.

            Below are the interview details:

            📅 Date: %s
            ⏰ Time: %s
            📍 Location / Mode: %s

            Please make sure to join on time and keep your resume and necessary documents ready.

            If you are unable to attend, kindly inform us in advance.

            We wish you all the best!

            Best Regards,
            JobConnect Hiring Team
            support@jobconnect.com
            www.jobconnect.com
            """.formatted(name, jobTitle, company, date, time, location);

    sendMail(to, "Interview Invitation – " + company, body);
}


    // ================= HR REPLY =================

   public void sendHRReplyMail(String to, String name, String message) {

    String body = """
            Dear %s,

            Thank you for reaching out to us.

            %s

            If you have any further questions, feel free to reply to this email.

            We appreciate your interest in JobConnect and wish you all the best.

            Best Regards,
            JobConnect HR Team
            support@jobconnect.com
            www.jobconnect.com
            """.formatted(name, message);

    sendMail(to, "Response from JobConnect HR Team", body);
}

}
