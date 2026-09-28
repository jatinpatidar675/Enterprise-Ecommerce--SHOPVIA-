package com.example.demo.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================
    // REGISTER USER
    // =========================================

    public User registerUser(User user) {

        if (user == null) {
            throw new RuntimeException(
                "User data is required"
            );
        }

        if (user.getName() == null ||
            user.getName().trim().isEmpty()) {

            throw new RuntimeException(
                "Name is required"
            );
        }

        if (user.getEmail() == null ||
            user.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                "Email is required"
            );
        }

        if (user.getPassword() == null ||
            user.getPassword().isEmpty()) {

            throw new RuntimeException(
                "Password is required"
            );
        }

        if (user.getPhone() == null ||
            user.getPhone().trim().isEmpty()) {

            throw new RuntimeException(
                "Phone is required"
            );
        }

        String email =
            user.getEmail().trim().toLowerCase();

        // Check duplicate email

        User existingUser =
            userRepository.findByEmail(email);

        if (existingUser != null) {

            throw new RuntimeException(
                "An account with this email already exists."
            );
        }

        user.setName(
            user.getName().trim()
        );

        user.setEmail(email);

        user.setPhone(
            user.getPhone().trim()
        );

        // Encrypt password

        user.setPassword(
            passwordEncoder.encode(
                user.getPassword()
            )
        );

        // Default role

        if (user.getRole() == null ||
            user.getRole().trim().isEmpty()) {

            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    // =========================================
    // FIND USER BY ID
    // =========================================

    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException(
                        "User not found with ID: " + id
                    )
                );
    }

    // =========================================
    // FIND USER BY EMAIL
    // =========================================

    public User findByEmail(String email) {

        if (email == null ||
            email.trim().isEmpty()) {

            return null;
        }

        return userRepository.findByEmail(
            email.trim().toLowerCase()
        );
    }

    // =========================================
    // GET ALL USERS
    // =========================================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // =========================================
    // DELETE USER
    // =========================================

    public void deleteUser(Long id) {

        userRepository.deleteById(id);
    }

    // =========================================
    // CHECK PASSWORD
    // =========================================

    public boolean checkPassword(
            String rawPassword,
            String encodedPassword) {

        if (rawPassword == null ||
            encodedPassword == null) {

            return false;
        }

        return passwordEncoder.matches(
            rawPassword,
            encodedPassword
        );
    }
}