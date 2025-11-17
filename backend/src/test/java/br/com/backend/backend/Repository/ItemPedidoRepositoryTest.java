package br.com.backend.backend.Repository;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import br.com.backend.backend.model.Endereco;
import br.com.backend.backend.model.ItemPedido;
import br.com.backend.backend.model.Pedido;
import br.com.backend.backend.model.Pessoa;
import br.com.backend.backend.model.Produto;
import br.com.backend.backend.repository.EnderecoRepository;
import br.com.backend.backend.repository.ItemPedidoRepository;
import br.com.backend.backend.repository.PedidoRepository;
import br.com.backend.backend.repository.PessoaRepository;
import br.com.backend.backend.repository.ProdutoRepository;

@ActiveProfiles("test")
@DataJpaTest
public class ItemPedidoRepositoryTest {
    @Autowired
    ProdutoRepository produtoRepository;

    @Autowired
    PessoaRepository pessoaRepository;

    @Autowired
    PedidoRepository pedidoRepository;

    @Autowired
    EnderecoRepository enderecoRepository;

    @Autowired
    ItemPedidoRepository itemPedidoRepository;

    @Test
    void deveAcharOItemPorIdDoPedido() {
        Produto produto = new Produto();
        produto.setNome("Monitor");
        produto.setPreco(1900.00);
        produto.setDescricao("Monitor gamer 144hz, deixando sua gameplay mais fluída e dinâmica.");
        produto.setQuantidadeEstoque(50);
        produto.setAvaliacao(4.5);
        produtoRepository.save(produto);

        Pessoa pessoa = new Pessoa();
        pessoa.setNome("Lucas Amorim");
        pessoa.setEmail("teste@email.com");
        pessoa.setSenha("123456");
        pessoa.setGenero("masculino");
        pessoa.setCpf("11111111111");
        pessoa.setGrupo("teste");
        pessoa.setData_nascimento(new java.sql.Date(new Date().getTime()));
        ;
        pessoaRepository.save(pessoa);
        Long idPessoa = pessoa.getId();

        Endereco endereco = new Endereco();
        endereco.setCep("12345678");
        endereco.setBairro("Bairro Teste");
        endereco.setLogradouro("Rua Teste");
        endereco.setNumero("123");
        endereco.setComplemento("Apto 101");
        endereco.setCidade("Cidade Teste");
        endereco.setEstado("Estado Teste");
        endereco.setPessoa(pessoa);
        endereco.setTipo("residencial");
        enderecoRepository.save(endereco);

        ItemPedido itemPedido = new ItemPedido();
        itemPedido.setProdutoId(produto.getId());
        itemPedido.setQuantidade(2);
        itemPedido.setPrecoUnitario(produto.getPreco());
        itemPedidoRepository.save(itemPedido);

        Pedido pedido = new Pedido();
        pedido.setPessoa(pessoa);
        pedido.setEnderecoId(endereco.getId());
        pedido.setDataCriacao(LocalDateTime.now());
        pedido.setFormaPagamento("pix");
        pedido.setStatus("em andamento");
        pedido.setValorTotal(120.00);
        List <ItemPedido> itens = List.of(itemPedido);
        pedido.setItens(itens);
        pedido.setFrete(11.44);
        pedidoRepository.save(pedido);

        List <ItemPedido> itensAchados = itemPedidoRepository.findByPedidoId(pedido.getId());

        assertThat(itensAchados).isNotEmpty();
    }

}
