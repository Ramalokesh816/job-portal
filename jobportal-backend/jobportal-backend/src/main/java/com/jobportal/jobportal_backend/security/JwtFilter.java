package com.jobportal.jobportal_backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        String path = request.getRequestURI();


        // ✅ PUBLIC APIs (NO JWT REQUIRED)
        if (path.startsWith("/api/users/login")
            || path.startsWith("/api/users/register")
            || path.startsWith("/api/users/google-login")
            || path.startsWith("/api/applications/verify")) {

            filterChain.doFilter(request, response);
            return;
        }


        String authHeader =
                request.getHeader("Authorization");


        // ❌ No token → continue (not force 401 here)
        if (authHeader == null
            || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }


        String token =
                authHeader.substring(7);

        try {

            String email =
                    jwtUtil.extractEmail(token);


            if (email != null
                && SecurityContextHolder
                       .getContext()
                       .getAuthentication() == null) {

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                null
                        );

                auth.setDetails(
                    new WebAuthenticationDetailsSource()
                        .buildDetails(request)
                );

                SecurityContextHolder
                    .getContext()
                    .setAuthentication(auth);
            }

        } catch (Exception e) {

            // ❌ Invalid token
            response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
