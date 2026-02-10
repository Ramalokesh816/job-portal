package com.jobportal.jobportal_backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.jobportal_backend.model.User;
import com.jobportal.jobportal_backend.repository.UserRepository;
import com.jobportal.jobportal_backend.security.JwtUtil;
import com.jobportal.jobportal_backend.service.EmailService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    /* ================= AUTOWIRED ================= */

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();


    /* ================= REGISTER ================= */

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        if (user.getEmail() == null ||
            user.getPassword() == null) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message",
                        "Missing fields"
                    ));
        }

        if (userRepository
                .findByEmail(user.getEmail())
                .isPresent()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message",
                        "Email already exists"
                    ));
        }

        user.setPassword(
                encoder.encode(user.getPassword())
        );

        user.setRole("USER");
        user.setProvider("local");

        User saved =
                userRepository.save(user);

        return ResponseEntity.ok(saved);
    }


    /* ================= LOGIN ================= */

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User loginUser) {

        Optional<User> optional =
                userRepository.findByEmail(
                        loginUser.getEmail());

        if (optional.isEmpty()) {

            return ResponseEntity.status(401)
                    .body(Map.of(
                        "message",
                        "User not found"
                    ));
        }

        User user = optional.get();

        if (!encoder.matches(
                loginUser.getPassword(),
                user.getPassword())) {

            return ResponseEntity.status(401)
                    .body(Map.of(
                        "message",
                        "Wrong password"
                    ));
        }

        String token =
                jwtUtil.generateToken(
                        user.getEmail());

        return ResponseEntity.ok(
                Map.of(
                    "token", token,
                    "user", user
                ));
    }


    /* ================= GOOGLE LOGIN ================= */

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(
            @RequestBody User googleUser) {

        Optional<User> optional =
                userRepository.findByEmail(
                        googleUser.getEmail());

        User user;

        if (optional.isPresent()) {

            user = optional.get();

        } else {

            user = new User();

            user.setName(googleUser.getName());
            user.setEmail(googleUser.getEmail());
            user.setRole("USER");
            user.setProvider("google");
            user.setPassword("GOOGLE_USER");

            user = userRepository.save(user);
        }

        String token =
                jwtUtil.generateToken(
                        user.getEmail());

        return ResponseEntity.ok(
            Map.of(
                "token", token,
                "user", user
            )
        );
    }


    /* ================= UPDATE PROFILE ================= */

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(
            @RequestBody User updated) {

        Optional<User> optional =
                userRepository.findByEmail(
                        updated.getEmail());

        if (optional.isEmpty()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message",
                        "User not found"
                    ));
        }

        User user = optional.get();

        user.setName(updated.getName());
        user.setPhone(updated.getPhone());

        User saved =
                userRepository.save(user);

        return ResponseEntity.ok(saved);
    }


/* ================= TEST MAIL ================= */

@RequestMapping(
    value = "/test-mail",
    method = {RequestMethod.GET, RequestMethod.POST}
)
@SuppressWarnings("CallToPrintStackTrace")
public ResponseEntity<?> testMail() {

    try {

        emailService.sendVerificationMail(
            "jramalokesh04@gmail.com",
            "https://example.com/test"
        );

        return ResponseEntity.ok(
            Map.of("message", "Test mail sent ✅")
        );

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .status(500)
                .body(Map.of("message", "Mail failed ❌"));
    }
}


}
