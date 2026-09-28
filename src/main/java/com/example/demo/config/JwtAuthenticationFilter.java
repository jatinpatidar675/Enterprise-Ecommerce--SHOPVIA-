package com.example.demo.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.entity.User;
import com.example.demo.service.JwtService;
import com.example.demo.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserService userService) {

        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // No JWT token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            // Extract email from JWT
            String email = jwtService.extractEmail(token);

            // Find user from database
            User user = userService.findByEmail(email);

            if (user != null
                    && jwtService.isTokenValid(token, user)
                    && SecurityContextHolder.getContext()
                            .getAuthentication() == null) {

                // =========================
                // ROLE
                // =========================

                String role = user.getRole();

                if (role != null) {
                    role = role.trim().toUpperCase();

                    // Remove ROLE_ if database already contains it
                    if (role.startsWith("ROLE_")) {
                        role = role.substring(5);
                    }
                }

                // =========================
                // USER DETAILS
                // =========================

                UserDetails userDetails =
                        org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .authorities(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + role
                                        )
                                )
                                .build();

                // =========================
                // AUTHENTICATION
                // =========================

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                System.out.println(
                        "JWT Authentication successful: "
                        + email
                        + " | ROLE_" + role
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT Authentication failed: "
                    + e.getMessage()
            );
        }

        filterChain.doFilter(request, response);
    }
}