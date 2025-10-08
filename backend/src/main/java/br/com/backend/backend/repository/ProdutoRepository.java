package br.com.backend.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.backend.backend.model.Produto;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByNomeContainingIgnoreCase(String nome);
    List<Produto> findByStatus(String status);
    List<Produto> findByPrecoLessThanEqual(Double preco);
    List<Produto> findByQuantidadeEstoqueGreaterThan(Integer quantidade);
}
