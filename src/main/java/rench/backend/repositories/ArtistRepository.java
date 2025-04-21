package rench.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rench.backend.models.Artist;

@Repository
public interface ArtistRepository  extends JpaRepository<Artist, Integer> {

}
