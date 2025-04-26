package rench.backend.controllers;

import rench.backend.models.Museum;
import rench.backend.models.User;
import rench.backend.repositories.MuseumRepository;
import rench.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    MuseumRepository museumRepository;
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (user.login == null || user.login.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "emptylogin"));
        }
        try {
            User newUser = userRepository.save(user);
            return ResponseEntity.ok(newUser);
        } catch (Exception ex) {
            String error = ex.getMessage().contains("users.login") ? "useralreadyexists" : "undefinederror";
            return ResponseEntity.badRequest().body(Map.of("error", error));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long userId, @RequestBody User userDetails) {
        Optional<User> uu = userRepository.findById(Math.toIntExact(userId));
        if (uu.isPresent()) {
            User user = uu.get();
            user.login = userDetails.login;
            user.email = userDetails.email;
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable("id") Long userId) {
        Optional<User> uu = userRepository.findById(Math.toIntExact(userId));
        Map<String, Boolean> resp = new HashMap<>();
        if (uu.isPresent()) {
            userRepository.delete(uu.get());
            resp.put("deleted", true);
        } else {
            resp.put("deleted", false);
        }
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/users/{id}/addmuseums")
    public ResponseEntity<Object> addMuseums(@PathVariable(value = "id") Long userId,
                                             @Valid @RequestBody Set<Museum> museums) {
        Optional<User> uu = userRepository.findById(Math.toIntExact(userId));
        int cnt = 0;
        if (uu.isPresent()) {
            User u = uu.get();
            for (Museum m : museums) {
                Optional<Museum>
                        mm = museumRepository.findById(m.id);
                if (mm.isPresent()) {
                    u.addMuseum(mm.get());
                    cnt++;
                }
            }
            userRepository.save(u);
        }
        Map<String, String> response = new HashMap<>();
        response.put("count", String.valueOf(cnt));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/{id}/removemuseums")
    public ResponseEntity<Object> removeMuseums(@PathVariable(value = "id") Long userId,
                                                @Valid @RequestBody Set<Museum> museums) {
        Optional<User> uu = userRepository.findById(Math.toIntExact(userId));
        int cnt = 0;
        if (uu.isPresent()) {
            User u = uu.get();
            for (Museum m : u.museums) {
                u.removeMuseum(m);
                cnt++;
            }
            userRepository.save(u);
        }
        Map<String, String> response = new HashMap<>();
        response.put("count", String.valueOf(cnt));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
