package br.senac.integrador.projeto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.senac.integrador.projeto.model.Pessoa;

import java.util.List;

@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
    List<Pessoa> findByEmailAndSenha(String email, String senha); // Alterado para buscar por email
}