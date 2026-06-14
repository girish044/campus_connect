package com.example.campusconnect.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        // check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered. Please login.");
            return ResponseEntity.badRequest().body(response);
        }

        // basic validation
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Name is required.");
            return ResponseEntity.badRequest().body(response);
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Email is required.");
            return ResponseEntity.badRequest().body(response);
        }

        if (user.getPassword() == null || user.getPassword().length() < 6) {
            response.put("success", false);
            response.put("message", "Password must be at least 6 characters.");
            return ResponseEntity.badRequest().body(response);
        }

        userRepository.save(user);

        response.put("success", true);
        response.put("message", "Account created successfully! Please login.");
        return ResponseEntity.ok(response);
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> creds) {
        Map<String, Object> response = new HashMap<>();

        String email = creds.get("email");
        String password = creds.get("password");

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            response.put("success", false);
            response.put("message", "No account found with this email.");
            return ResponseEntity.badRequest().body(response);
        }

        User user = optionalUser.get();

        if (!user.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Incorrect password. Please try again.");
            return ResponseEntity.badRequest().body(response);
        }

        // Don't send password back to frontend
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("college", user.getCollege());
        userInfo.put("phone", user.getPhone());

        response.put("success", true);
        response.put("message", "Login successful! Welcome " + user.getName());
        response.put("user", userInfo);
        return ResponseEntity.ok(response);
    }

    // GET PROFILE
    @GetMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }

        User user = optionalUser.get();

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("college", user.getCollege());
        userInfo.put("phone", user.getPhone());

        response.put("success", true);
        response.put("user", userInfo);
        return ResponseEntity.ok(response);
    }

    // UPDATE PROFILE
    @PutMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> data) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }

        User user = optionalUser.get();

        if (data.containsKey("name")) user.setName(data.get("name"));
        if (data.containsKey("college")) user.setCollege(data.get("college"));
        if (data.containsKey("phone")) user.setPhone(data.get("phone"));

        userRepository.save(user);

        response.put("success", true);
        response.put("message", "Profile updated successfully.");
        return ResponseEntity.ok(response);
    }
}
