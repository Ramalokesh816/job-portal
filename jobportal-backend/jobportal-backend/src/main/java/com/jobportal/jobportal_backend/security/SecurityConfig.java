package com.jobportal.jobportal_backend.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http

            // Enable CORS
            .cors(cors -> cors.configurationSource(corsSource()))

            // Disable CSRF
            .csrf(csrf -> csrf.disable())

            // Stateless JWT
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // Authorization
            .authorizeHttpRequests(auth -> auth

                // PUBLIC APIs
                .requestMatchers(
                    "/api/users/login",
                    "/api/users/register",
                    "/api/users/google-login",

                    // EMAIL VERIFY (IMPORTANT)
                    "/api/applications/verify",
                    "/api/applications/verify/**"
                ).permitAll()

                // Everything else protected
                .anyRequest().authenticated()
            )

            // JWT Filter
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }


    // CORS Config
    @Bean
    public CorsConfigurationSource corsSource() {

        CorsConfiguration config =
                new CorsConfiguration();

        config.setAllowedOrigins(
            List.of("http://localhost:3000")
        );

        config.setAllowedMethods(
            List.of("GET","POST","PUT","DELETE","OPTIONS")
        );

        config.setAllowedHeaders(
            List.of("*")
        );

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
