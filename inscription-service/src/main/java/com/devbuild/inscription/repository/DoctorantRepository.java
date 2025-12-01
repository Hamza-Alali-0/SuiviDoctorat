package com.devbuild.inscription.repository;

import com.devbuild.inscription.model.Doctorant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorantRepository extends JpaRepository<Doctorant, Long> {
    Optional<Doctorant> findByEmail(String email);
    // Use findFirstByEmail to handle duplicate email scenario gracefully
    Optional<Doctorant> findFirstByEmail(String email);
    List<Doctorant> findAllByEmail(String email);
}
