package rench.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rench.backend.models.Country;

@Repository
public interface CountryRepository  extends JpaRepository<Country, Long>
{

}
