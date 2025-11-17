package br.com.backend.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.com.backend.backend.model.Produto;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByNomeContainingIgnoreCase(String nome);
    List<Produto> findByStatus(String status);

    

@Query(value = """
        SELECT p.* 
        FROM produtos p 
        INNER JOIN itens_pedido ip ON p.id = ip.produto_id
        INNER JOIN pedidos pe ON ip.pedido_id = pe.id
        WHERE pe.id_pessoa = :idPessoa
        """, nativeQuery = true)
    List<Produto> buscarPorIdPessoa(@Param("idPessoa") Long idPessoa);




}
