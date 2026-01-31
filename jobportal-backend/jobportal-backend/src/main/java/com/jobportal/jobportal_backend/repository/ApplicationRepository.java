package com.jobportal.jobportal_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.jobportal_backend.model.Application;

public interface ApplicationRepository 
        extends MongoRepository<Application, String> {

    // Find applications by user email
    List<Application> findByUserEmail(String userEmail);
}
