package rench.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import rench.backend.models.Country;
import rench.backend.repositories.CountryRepository;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class CountryController {
    @Autowired
    CountryRepository countryRepository;

    @PostMapping("/countries")
    public ResponseEntity<?> createCountry(@RequestBody Country country) {
        if (country.getName() == null || country.getName().trim().isEmpty()) {
            Map<String, String> error = Map.of("error", "emptyname");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            Country nc = countryRepository.save(country);
            return ResponseEntity.ok(nc);
        } catch (Exception ex) {
            String error = ex.getMessage().contains("countries.name_UNIQUE") ?
                    "countyalreadyexists" : "undefinederror";
            Map<String, String> errorMap = Map.of("error", error);
            return ResponseEntity.badRequest().body(errorMap);
        }
    }

    @PutMapping("/countries/{id}")
    public ResponseEntity<Country> updateCountry(@PathVariable(value = "id") Long countryId,
                                                 @RequestBody Country countryDetails) {
        Country country = null;
        Optional<Country>
                cc = countryRepository.findById(countryId);
        if (cc.isPresent()) {
            country = cc.get();
            country.name = countryDetails.name;
            countryRepository.save(country);
            return ResponseEntity.ok(country);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "country not found");
        }
    }

    @DeleteMapping("/countries/{id}")
    public ResponseEntity<Object> deleteCountry(@PathVariable(value = "id") Long countryId) {
        Optional<Country>
                country = countryRepository.findById(countryId);
        Map<String, Boolean>
                resp = new HashMap<>();
        if (country.isPresent()) {
            countryRepository.delete(country.get());
            resp.put("deleted", Boolean.TRUE);
        }
        else
            resp.put("deleted", Boolean.FALSE);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/countries")
    public List
    getAllCountries() {
        return countryRepository.findAll();
    }
}
