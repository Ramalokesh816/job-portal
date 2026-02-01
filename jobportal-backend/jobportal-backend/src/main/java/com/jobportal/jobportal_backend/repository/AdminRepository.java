package com.jobportal.jobportal_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.jobportal_backend.model.Admin;

public interface AdminRepository extends MongoRepository<Admin, String> {

    Admin findByEmail(String email);
}
