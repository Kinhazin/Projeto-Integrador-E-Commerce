package br.com.backend.backend.controller;

import br.com.backend.backend.model.Pessoa;
import br.com.backend.backend.repository.PessoaRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.sql.Date;
import java.util.Optional;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PessoaController.class)
class PessoaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PessoaRepository pessoaRepository;

    private Pessoa criarPessoa(Long id, String nome, String email, String senha, String cpf, String status) {
        Pessoa p = new Pessoa();
        p.setId(id);
        p.setNome(nome);
        p.setEmail(email);
        p.setSenha(senha);
        p.setCpf(cpf);
        p.setStatus(status);
        p.setGrupo("ADM");
        p.setGenero("Masculino");
        p.setData_nascimento(Date.valueOf("2000-01-01"));
        return p;
    }

    @Test
    void deveListarPessoas() throws Exception {
        Pessoa p1 = criarPessoa(1L, "Lucas", "lucas@gmail.com", "123", "11111111111", "ativo");

        when(pessoaRepository.findAll()).thenReturn(List.of(p1));

        mockMvc.perform(get("/api/pessoas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Lucas"))
                .andExpect(jsonPath("$[0].email").value("lucas@gmail.com"));
    }

    @Test
    void deveAdicionarPessoa() throws Exception {
        Pessoa salva = criarPessoa(1L, "João", "joao@gmail.com", "senha", "22222222222", "ativo");

        when(pessoaRepository.save(any(Pessoa.class))).thenReturn(salva);

        mockMvc.perform(post("/api/pessoas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "João",
                                  "cpf": "22222222222",
                                  "email": "joao@gmail.com",
                                  "senha": "senha",
                                  "status": "ativo",
                                  "grupo": "ADM",
                                  "genero": "Masculino",
                                  "data_nascimento": "2000-01-01"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("João"));
    }

    @Test
    void deveAlterarStatus() throws Exception {
        Pessoa p = criarPessoa(1L, "Lucas", "lucas@gmail.com", "123", "11111111111", "ativo");

        when(pessoaRepository.findById(1L)).thenReturn(Optional.of(p));
        when(pessoaRepository.save(any(Pessoa.class))).thenReturn(p);

        mockMvc.perform(put("/api/pessoas/1/status"))
                .andExpect(status().isOk())
                .andExpect(content().string("Status atualizado para: inativo"));
    }
}
