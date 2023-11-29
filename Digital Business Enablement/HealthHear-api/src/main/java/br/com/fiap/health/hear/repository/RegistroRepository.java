package br.com.fiap.health.hear.repository;

import br.com.fiap.health.hear.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroRepository extends JpaRepository<Registro, Long> {
    
}