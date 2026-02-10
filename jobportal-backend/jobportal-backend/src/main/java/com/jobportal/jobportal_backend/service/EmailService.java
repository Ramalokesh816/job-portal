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

    public void sendThankYouMail(String to) {

        String body = """
                Dear Candidate,

                Your application is confirmed.

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

                Application Status: %s

                Regards,
                HR Team
                """.formatted(status);

        sendMail(to, "Status Update", body);
    }


    // ================= INTERVIEW =================

    public void sendInterviewMail(
            String to,
            String date,
            String time,
            String location) {

        String body = """
                Dear Candidate,

                Interview Scheduled:

                Date: %s
                Time: %s
                Location: %s

                Best of luck!

                HR Team
                """.formatted(date, time, location);

        sendMail(to, "Interview Invitation", body);
    }


    // ================= HR REPLY =================

    public void sendHRReplyMail(String to, String msg) {

        String body = """
                Dear Candidate,

                %s

                Regards,
                HR Team
                """.formatted(msg);

        sendMail(to, "HR Message", body);
    }

}
