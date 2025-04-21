package rench.backend.repositories;

import rench.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByToken(String s);

    Optional<User> findByLogin(String login);
}
