package com.jobportal.jobportal_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.jobportal_backend.model.Application;

public interface ApplicationRepository extends MongoRepository<Application, String> {
}
