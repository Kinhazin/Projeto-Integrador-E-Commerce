package br.com.backend.backend.Repository;
import br.com.backend.backend.model.Endereco;
import br.com.backend.backend.model.Pessoa;
import br.com.backend.backend.repository.EnderecoRepository;
import br.com.backend.backend.repository.PessoaRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@DataJpaTest
class EnderecoRepositoryTest {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private PessoaRepository pessoaRepository;

    @Test
    void deveAcharEnderecoPorIdDoCliente() {
        Pessoa pessoa = new Pessoa();
        pessoa.setNome("Lucas Amorim");
        pessoa.setEmail("teste@email.com");
        pessoa.setSenha("123456");
        pessoa.setGenero("masculino");
        pessoa.setCpf("11111111111");
        pessoa.setGrupo("teste");
        pessoa.setData_nascimento(new java.sql.Date(new Date().getTime()));;
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
        
        List<Endereco> enderecosAchados = enderecoRepository.findByPessoaId(Long.valueOf(idPessoa));
        assertThat(enderecosAchados).isNotEmpty();
    }
}