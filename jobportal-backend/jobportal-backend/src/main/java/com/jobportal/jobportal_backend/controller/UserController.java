package com.jobportal.jobportal_backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.jobportal_backend.model.User;
import com.jobportal.jobportal_backend.repository.UserRepository;
import com.jobportal.jobportal_backend.security.JwtUtil;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;


    // ========== REGISTER ==========
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        Optional<User> existing =
                userRepository.findByEmail(
                        user.getEmail());

        if (existing.isPresent()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message",
                        "Email already exists"));
        }

        user.setRole("USER");
        user.setProvider("local");

        User saved =
                userRepository.save(user);

        return ResponseEntity.ok(saved);
    }


    // ========== LOGIN ==========
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User loginUser) {

    String email =
            loginUser.getEmail().toLowerCase().trim();

    String password =
            loginUser.getPassword().trim();


    Optional<User> optionalUser =
            userRepository.findByEmail(email);


    if (optionalUser.isEmpty()) {

        return ResponseEntity
            .status(401)
            .body(Map.of("message", "User not found"));
    }


    User user = optionalUser.get();


    if (!user.getPassword().equals(password)) {

        return ResponseEntity
            .status(401)
            .body(Map.of("message", "Wrong password"));
    }


    // Generate JWT
    String token =
            jwtUtil.generateToken(user.getEmail());


    return ResponseEntity.ok(
        Map.of(
            "token", token,
            "user", user
        )
    );
}

    // ========== GOOGLE LOGIN ==========
   @PostMapping("/google-login")
public ResponseEntity<?> googleLogin(
        @RequestBody User googleUser) {

    Optional<User> optionalUser =
            userRepository.findByEmail(
                    googleUser.getEmail());

    User user;

    if (optionalUser.isPresent()) {

        user = optionalUser.get();

    } else {

        user = new User();

        user.setName(googleUser.getName());
        user.setEmail(googleUser.getEmail());
        user.setRole("USER");
        user.setProvider("google");
        user.setPassword("GOOGLE_USER");

        user = userRepository.save(user);
    }

    // Generate JWT
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

}
