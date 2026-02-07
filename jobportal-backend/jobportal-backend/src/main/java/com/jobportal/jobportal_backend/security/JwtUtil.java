package com.jobportal.jobportal_backend.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // FIXED SECRET (DO NOT CHANGE AFTER DEPLOY)
    private static final String SECRET =
            "jobportal_secret_key_123456789_very_strong";

    private final Key SECRET_KEY =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    // 24 hours
    private final long EXPIRATION =
            1000 * 60 * 60 * 24;


    public String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION
                        )
                )
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }


    public String extractEmail(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }


    public boolean validateToken(String token) {

        try {
            extractEmail(token);
            return true;

        } catch (Exception e) {
            return false;
        }
    }
}
