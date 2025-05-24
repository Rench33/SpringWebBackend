package rench.backend.controllers;

import rench.backend.models.Museum;
import rench.backend.models.Painting;
import rench.backend.repositories.PaintingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.awt.*;
import java.util.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class PaintingController {

    @Autowired
    PaintingRepository paintingRepository;

    @PostMapping("/paintings")
    public ResponseEntity<?> createPainting(@RequestBody Painting painting) {
        if (painting.name == null || painting.name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "emptyname"));
        }

        Painting p = paintingRepository.save(painting);
        return ResponseEntity.ok(p);
    }
    @GetMapping("/paintings/{id}")
    public ResponseEntity<Painting> getPainting(@PathVariable Long id) {
        Optional<Painting> painting = paintingRepository.findById(Math.toIntExact(id));
        return painting.map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Картина не найдена"));
    }
    @PostMapping("/deletepaintings")
    public ResponseEntity<?> deletePaintings(@RequestBody List<Painting> paintings) {
        paintingRepository.deleteAll(paintings);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PutMapping("/paintings/{id}")
    public ResponseEntity<Painting> updatePainting(@PathVariable Long id, @RequestBody Painting details) {
        Optional<Painting> pp = paintingRepository.findById(Math.toIntExact(id));
        if (pp.isPresent()) {
            Painting p = pp.get();
            p.name = details.name;
            p.year = details.year;
            p.artist = details.artist;
            p.museum = details.museum;
            paintingRepository.save(p);
            return ResponseEntity.ok(p);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "painting not found");
        }
    }

    @DeleteMapping("/paintings/{id}")
    public ResponseEntity<Object> deletePainting(@PathVariable Long id) {
        Optional<Painting> p = paintingRepository.findById(Math.toIntExact(id));
        Map<String, Boolean> resp = new HashMap<>();
        if (p.isPresent()) {
            paintingRepository.delete(p.get());
            resp.put("deleted", true);
        } else {
            resp.put("deleted", false);
        }
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/paintings")
    public List<Painting> getAllPaintings() {
        return paintingRepository.findAll();
    }
}
