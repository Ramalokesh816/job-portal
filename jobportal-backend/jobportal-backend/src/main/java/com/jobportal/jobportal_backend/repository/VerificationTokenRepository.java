package com.jobportal.jobportal_backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.jobportal_backend.model.EmailVerificationToken;

public interface VerificationTokenRepository
        extends MongoRepository<EmailVerificationToken, String> {

    // Find token in DB
    Optional<EmailVerificationToken> findByToken(String token);
}
