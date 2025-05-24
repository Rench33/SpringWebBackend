package rench.backend.controllers;

import rench.backend.models.Artist;
import rench.backend.models.Country;
import rench.backend.models.Museum;
import rench.backend.models.Painting;
import rench.backend.repositories.ArtistRepository;
import rench.backend.repositories.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
@CrossOrigin(origins = "http://localhost:3000")
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
    @DeleteMapping("/artists")
    public ResponseEntity<?> deleteArtists(@RequestBody List<Integer> artistIds) {
        try {
            artistRepository.deleteAllById(artistIds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ошибка удаления");
        }
    }

    //@GetMapping("/artists")
    //public Page<Artist> getAllArtists(
    //        @RequestParam(defaultValue = "0") int page,
    //        @RequestParam(defaultValue = "10") int size
    //) {
    //    return artistRepository.findAll(PageRequest.of(page, size, Sort.by("name")));
    //}

    @GetMapping("/artists/{id}")
    public ResponseEntity<Artist> getArtist(@PathVariable Long id) {
        Optional<Artist> artist = artistRepository.findById(Math.toIntExact(id));
        return artist.map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    @PutMapping("/artists/{id}")
    public ResponseEntity<Artist> updateArtist(
            @PathVariable("id") Long id,
            @RequestBody Artist artistDetails
    ) {
        // 1. Поиск художника
        Optional<Artist> optionalArtist = artistRepository.findById(Math.toIntExact(id));
        if (optionalArtist.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Художник не найден");
        }

        // 2. Обновление полей
        Artist artist = optionalArtist.get();
        artist.setName(artistDetails.getName());
        artist.setCentury(artistDetails.getCentury());

        // 3. Обновление страны (аналогично MuseumController)
        if (artistDetails.getCountry() != null && artistDetails.getCountry().getId() != 0) {
            Optional<Country> country = countryRepository.findById(artistDetails.getCountry().getId());
            if (country.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Неверная страна");
            }
            artist.setCountry(country.get());
        }

        // 4. Сохранение
        Artist updatedArtist = artistRepository.save(artist);
        return ResponseEntity.ok(updatedArtist);
    }
    @GetMapping("/artists/paged")
    public Page<Artist> getPagedArtists(
            @RequestParam("page") int page,
            @RequestParam("limit") int limit
    ) {
        return artistRepository.findAll(PageRequest.of(page, limit, Sort.by("name")));
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
    @PostMapping("/deleteartists")
    public ResponseEntity<?> deleteMuseums(@RequestBody List<Artist> artists) {
        artistRepository.deleteAll(artists);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/artists")
    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }
}
