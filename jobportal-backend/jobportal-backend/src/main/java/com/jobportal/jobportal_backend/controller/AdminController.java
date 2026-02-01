package com.jobportal.jobportal_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.jobportal_backend.model.Admin;
import com.jobportal.jobportal_backend.repository.AdminRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/register")
    public String register(@RequestBody Admin admin) {

        Admin existing =
            adminRepository.findByEmail(admin.getEmail());

        if (existing != null) {
            return "Admin already exists";
        }

        adminRepository.save(admin);

        return "Admin registered successfully";
    }

    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {

        Admin dbAdmin =
            adminRepository.findByEmail(admin.getEmail());

        if (dbAdmin == null) {
            return "Admin not found";
        }

        if (!dbAdmin.getPassword().equals(admin.getPassword())) {
            return "Invalid password";
        }

        return "Login success";
    }
}
