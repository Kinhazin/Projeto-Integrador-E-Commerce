package br.com.backend.backend.Repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import br.com.backend.backend.model.Produto;
import br.com.backend.backend.repository.ProdutoRepository;


@ActiveProfiles("test")
@DataJpaTest
public class ProdutoRepositoryTest {

    @Autowired
    ProdutoRepository produtoRepository;
    
    Produto produto;

    @BeforeEach
    void instanciarProduto(){
        produto = new Produto();
        produto.setNome("Monitor");
        produto.setPreco(1900.00);
        produto.setDescricao("Monitor gamer 144hz, deixando sua gameplay mais fluída e dinâmica.");
        produto.setQuantidadeEstoque(50);
        produto.setAvaliacao(4.5);
    }

    @Test
    void deveAcharProdutoPeloNome(){
        produtoRepository.save(produto);
        List<Produto> produtoAchado = produtoRepository.findByNomeContainingIgnoreCase("monitor");
        assertThat(produtoAchado).isNotEmpty();
    }

    @Test
    void deveAcharProdutoPeloStatus(){
        produtoRepository.save(produto);

        Produto produto2 = new Produto();
        produto2 = new Produto();
        produto2.setNome("Monitor normal");
        produto2.setPreco(1900.00);
        produto2.setDescricao("Monitor comum 60hz, deixando sua gameplay mais fluída e dinâmica.");
        produto2.setQuantidadeEstoque(50);
        produto2.setAvaliacao(4.5);
        produtoRepository.save(produto2);
        
        List<Produto> produtosAchados = produtoRepository.findByStatus("inativo");
        System.out.println(produtosAchados.size());
        assertThat(produtosAchados).hasSizeLessThan(1);
    }

    

}
