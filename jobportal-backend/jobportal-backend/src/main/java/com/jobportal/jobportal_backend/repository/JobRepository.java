package com.jobportal.jobportal_backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.jobportal_backend.model.Job;

public interface JobRepository extends MongoRepository<Job, String> {
}
