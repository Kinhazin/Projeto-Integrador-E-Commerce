package br.senac.integrador.projeto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.senac.integrador.projeto.model.Produto;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Buscar produtos por nome (contendo parte do texto)
    List<Produto> findByNomeContainingIgnoreCase(String nome);

    // Buscar produtos por status
    List<Produto> findByStatus(String status);

    // Buscar produtos com preço menor ou igual a um valor
    List<Produto> findByPrecoLessThanEqual(Double preco);

    // Buscar produtos com estoque maior que um valor
    List<Produto> findByQuantidadeEstoqueGreaterThan(Integer quantidade);
}
