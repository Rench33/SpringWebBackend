package rench.backend.controllers;

import rench.backend.models.Artist;
import rench.backend.models.Country;
import rench.backend.repositories.ArtistRepository;
import rench.backend.repositories.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class ArtistController {

    @Autowired
    ArtistRepository artistRepository;

    @Autowired
    CountryRepository countryRepository;

    @PostMapping("/artists")
    public ResponseEntity<?> createArtist(@RequestBody Artist artist) {
        if (artist.name == null || artist.name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "emptyname"));
        }
        if (artist.century == null || artist.century.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "emptycentury"));
        }
        if (artist.country == null || artist.country.id == 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "emptycountry"));
        }

        try {
            Optional<Country> country = countryRepository.findById(artist.country.id);
            if (country.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "invalidcountry"));
            }
            artist.country = country.get();
            Artist newArtist = artistRepository.save(artist);
            return ResponseEntity.ok(newArtist);
        } catch (Exception ex) {
            String error = ex.getMessage().contains("artists.name_UNIQUE")
                    ? "artistexists" : "undefinederror";
            return ResponseEntity.badRequest().body(Map.of("error", error));
        }
    }

    @PutMapping("/artists/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable Long id, @RequestBody Artist artistDetails) {
        Optional<Artist> optionalArtist = artistRepository.findById(Math.toIntExact(id));
        if (optionalArtist.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "artist not found");
        }

        Artist artist = optionalArtist.get();
        artist.name = artistDetails.name;
        artist.century = artistDetails.century;

        if (artistDetails.country != null && artistDetails.country.id != 0) {
            Optional<Country> country = countryRepository.findById(artistDetails.country.id);
            if (country.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid country");
            }
            artist.country = country.get();
        }

        Artist updatedArtist = artistRepository.save(artist);
        return ResponseEntity.ok(updatedArtist);
    }

    @DeleteMapping("/artists/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteArtist(@PathVariable Long id) {
        Optional<Artist> artist = artistRepository.findById(Math.toIntExact(id));
        Map<String, Boolean> response = new HashMap<>();
        if (artist.isPresent()) {
            artistRepository.delete(artist.get());
            response.put("deleted", true);
        } else {
            response.put("deleted", false);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/artists")
    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }
}
