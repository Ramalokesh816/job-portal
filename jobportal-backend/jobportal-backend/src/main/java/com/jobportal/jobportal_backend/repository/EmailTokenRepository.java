package com.jobportal.jobportal_backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.jobportal_backend.model.EmailVerificationToken;

public interface EmailTokenRepository
        extends MongoRepository<EmailVerificationToken, String> {

    Optional<EmailVerificationToken> findByToken(String token);
}
