package br.com.backend.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.backend.backend.model.Endereco;


@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
}
