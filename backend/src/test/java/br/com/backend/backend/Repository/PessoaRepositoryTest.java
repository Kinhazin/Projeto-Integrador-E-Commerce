package br.com.backend.backend.Repository;
import br.com.backend.backend.repository.PessoaRepository;
import br.com.backend.backend.model.Pessoa;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@DataJpaTest
class PessoaRepositoryTest {

    @Autowired
    private PessoaRepository pessoaRepository;

    @Test
    void deveSalvarPessoa() {
        // Arrange
        Pessoa pessoa = new Pessoa();
        pessoa.setNome("Lucas Amorim");
        pessoa.setEmail("teste@email.com");
        pessoa.setSenha("123456");
        pessoa.setGenero("masculino");
        pessoa.setCpf("11111111111");
        pessoa.setGrupo("teste");
        pessoa.setData_nascimento(new java.sql.Date(new Date().getTime()));;
        pessoaRepository.save(pessoa);

        // Act
         List<Pessoa> resultado = pessoaRepository.findByEmailAndSenha("teste@email.com", "123456");
        // Assert
        assertThat(resultado).isNotEmpty();
    }
}