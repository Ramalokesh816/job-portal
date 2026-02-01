package com.jobportal.jobportal_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.jobportal_backend.model.User;
import com.jobportal.jobportal_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;


    /* ===== REGISTER ===== */
    @PostMapping("/register")
    public String register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "User already exists";
        }

        userRepository.save(user);

        return "Registered successfully";
    }


    /* ===== LOGIN ===== */
    @PostMapping("/login")
    public User login(@RequestBody User user) {

        return userRepository
            .findByEmail(user.getEmail())
            .filter(u -> u.getPassword().equals(user.getPassword()))
            .orElse(null);
    }


    /* ===== UPDATE PROFILE ===== */
    @PutMapping("/update")
    public User update(@RequestBody User user) {

        return userRepository.save(user);
    }
}
