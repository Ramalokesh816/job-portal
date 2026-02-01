package com.jobportal.jobportal_backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.jobportal.jobportal_backend.model.User;
import com.jobportal.jobportal_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // allow vercel + localhost
public class UserController {

    @Autowired
    private UserRepository userRepository;


    /* ================= REGISTER ================= */

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        // Check if email already exists
        Optional<User> existing =
                userRepository.findByEmail(user.getEmail());

        if (existing.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        return userRepository.save(user);
    }


    /* ================= LOGIN ================= */

    @PostMapping("/login")
    public User login(@RequestBody User loginUser) {

        User user = userRepository
                .findByEmail(loginUser.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!user.getPassword().equals(loginUser.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        // return full user
        return user;
    }

}
