package br.com.backend.backend.repository;

import br.com.backend.backend.model.ProdutoImagem;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProdutoImagemRepository extends JpaRepository<ProdutoImagem, Long> {
    @Query("SELECT pi FROM ProdutoImagem pi JOIN FETCH pi.produto WHERE pi.id = :id")
    Optional<ProdutoImagem> findByIdWithProduto(@Param("id") Long id);

    List<ProdutoImagem> findAllByProduto_IdOrderByOrdemAsc(Long produtoId);

    Optional<ProdutoImagem> findFirstByProduto_IdOrderByOrdemAsc(Long produtoId);
}