package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.entity.User;
import com.example.demo.service.JwtService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    // =========================================
    // REGISTER
    // POST /api/auth/register
    // =========================================

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User register(
            @RequestBody User user) {

        return userService.registerUser(user);
    }

    // =========================================
    // LOGIN
    // POST /api/auth/login
    // =========================================

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        if (request == null ||
            request.getEmail() == null ||
            request.getPassword() == null) {

            throw new RuntimeException(
                "Email and password are required"
            );
        }

        User user =
            userService.findByEmail(
                request.getEmail().trim()
            );

        if (user == null) {

            throw new RuntimeException(
                "Invalid email or password"
            );
        }

        boolean passwordMatches =
            userService.checkPassword(
                request.getPassword(),
                user.getPassword()
            );

        if (!passwordMatches) {

            throw new RuntimeException(
                "Invalid email or password"
            );
        }

        String token =
            jwtService.generateToken(user);

        return new LoginResponse(
            token,
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
    }
}