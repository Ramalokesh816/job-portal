package com.jobportal.jobportal_backend.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http

            // Enable CORS
            .cors(cors -> cors.configurationSource(corsSource()))

            // Disable CSRF
            .csrf(csrf -> csrf.disable())

            // Disable Session (Stateless)
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // Allow ALL requests (TEMP FIX)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )

            // Disable default login
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }


    // =========================
    // CORS CONFIGURATION
    // =========================
    @Bean
    public CorsConfigurationSource corsSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Your React URL
        config.setAllowedOrigins(
            List.of(
                "http://localhost:3000",
                "https://job-portal-5-cg3o.onrender.com"
            )
        );

        config.setAllowedMethods(
            List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        config.setAllowedHeaders(List.of("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
