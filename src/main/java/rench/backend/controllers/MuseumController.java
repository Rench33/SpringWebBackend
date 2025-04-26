package rench.backend.controllers;

import rench.backend.models.Museum;
import rench.backend.repositories.MuseumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class MuseumController {

    @Autowired
    MuseumRepository museumRepository;

    @GetMapping("/museums")
    public List<Museum> getAllMuseums() {
        return museumRepository.findAll();
    }

    @PostMapping("/museums")
    public ResponseEntity<?> createMuseum(@RequestBody Museum museum) {
        if (museum.name == null || museum.name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "emptyname"));
        }
        try {
            Museum saved = museumRepository.save(museum);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            String error = ex.getMessage().contains("museums.name") ? "museumalreadyexists" : "undefinederror";
            return ResponseEntity.badRequest().body(Map.of("error", error));
        }
    }

    @PutMapping("/museums/{id}")
    public ResponseEntity<Museum> updateMuseum(@PathVariable("id") Long id,
                                               @RequestBody Museum museumDetails) {
        Optional<Museum> mm = museumRepository.findById(Math.toIntExact(id));
        if (mm.isPresent()) {
            Museum museum = mm.get();
            museum.name = museumDetails.name;
            museum.location = museumDetails.location;
            museumRepository.save(museum);
            return ResponseEntity.ok(museum);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "museum not found");
        }
    }

    @DeleteMapping("/museums/{id}")
    public ResponseEntity<Object> deleteMuseum(@PathVariable("id") Long id) {
        Optional<Museum> museum = museumRepository.findById(Math.toIntExact(id));
        Map<String, Boolean> resp = new HashMap<>();
        if (museum.isPresent()) {
            museumRepository.delete(museum.get());
            resp.put("deleted", true);
        } else {
            resp.put("deleted", false);
        }
        return ResponseEntity.ok(resp);
    }
}
