package rench.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "countries")
@Access(AccessType.FIELD)
public class Country {

    public Country() { }

    public Country(int id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    public int id;

    @Column(name = "name", nullable = false, unique = true)
    public String name;

    @JsonIgnore
    @OneToMany(mappedBy = "country")
    public List<Artist> artists = new ArrayList<>();

    // Геттеры
    public int getId() { // Добавлен геттер для id
        return id;
    }

    public String getName() {
        return name;
    }

    // Сеттеры
    public void setId(int id) { // Добавлен сеттер для id
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}