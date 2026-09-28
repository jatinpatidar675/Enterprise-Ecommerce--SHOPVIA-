package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            // =====================================
            // CORS
            // =====================================

            .cors(cors ->
                cors.configurationSource(
                    corsConfigurationSource()
                )
            )

            // =====================================
            // CSRF
            // =====================================

            .csrf(csrf ->
                csrf.disable()
            )

            // =====================================
            // SESSION
            // =====================================

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // =====================================
            // AUTHORIZATION
            // =====================================

            .authorizeHttpRequests(auth -> auth

                // CORS preflight

                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // Authentication

                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // User APIs

                .requestMatchers(
                    "/api/users/**"
                ).permitAll()

                // Product APIs

                .requestMatchers(
                    "/api/products/**"
                ).permitAll()

                // Cart APIs

                .requestMatchers(
                    "/api/cart/**"
                ).permitAll()

                // Order APIs

                .requestMatchers(
                    "/api/orders/**"
                ).permitAll()

                // Images

                .requestMatchers(
                    "/images/**"
                ).permitAll()

                // Everything else for now

                .anyRequest().permitAll()
            );

        return http.build();
    }

    // =========================================
    // CORS CONFIGURATION
    // =========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
            new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of(
                "http://localhost:5173"
            )
        );

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }
}