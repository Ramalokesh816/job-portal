package com.jobportal.jobportal_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.jobportal_backend.model.Employer;

public interface EmployerRepository
        extends MongoRepository<Employer, String> {
}
