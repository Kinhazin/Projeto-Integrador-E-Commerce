package br.com.backend.backend.controller;

import br.com.backend.backend.model.Endereco;
import br.com.backend.backend.model.Pessoa;
import br.com.backend.backend.service.EnderecoService;
import br.com.backend.backend.repository.PessoaRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EnderecoController.class)
class EnderecoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EnderecoService enderecoService;

    @MockBean
    private PessoaRepository pessoaRepository;


    @Test
    void deveListarTodos() throws Exception {
        when(enderecoService.listarTodos()).thenReturn(List.of(new Endereco()));

        mockMvc.perform(get("/api/enderecos"))
                .andExpect(status().isOk());
    }


    @Test
    void deveBuscarPorId() throws Exception {
        Endereco endereco = new Endereco();
        endereco.setId(1L);

        when(enderecoService.buscarPorId(1L)).thenReturn(Optional.of(endereco));

        mockMvc.perform(get("/api/enderecos/1"))
                .andExpect(status().isOk());
    }

    @Test
    void deveRetornar404_QuandoEnderecoNaoExiste() throws Exception {
        when(enderecoService.buscarPorId(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/enderecos/99"))
                .andExpect(status().isNotFound());
    }


    @Test
    void deveListarEnderecosPorPessoa() throws Exception {
        Pessoa p = new Pessoa();
        p.setId(1L);

        when(pessoaRepository.findById(1L)).thenReturn(Optional.of(p));
        when(enderecoService.buscarPorPessoaId(1L)).thenReturn(List.of(new Endereco()));

        mockMvc.perform(get("/api/enderecos/por-pessoa/1"))
                .andExpect(status().isOk());
    }

    @Test
    void deveRetornar400_QuandoPessoaNaoExiste() throws Exception {
        when(pessoaRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/enderecos/por-pessoa/1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveCriarEndereco() throws Exception {
        Pessoa pessoa = new Pessoa();
        pessoa.setId(1L);

        Endereco salvo = new Endereco();
        salvo.setId(10L);
        salvo.setPessoa(pessoa);

        String json = """
                {
                  "cep": "12345-678",
                  "bairro": "Centro",
                  "logradouro": "Rua A",
                  "numero": "100",
                  "complemento": "Casa",
                  "tipo": "faturamento",
                  "cidade": "São Paulo",
                  "estado": "SP",
                  "pessoa": { "id": 1 }
                }
                """;

        when(pessoaRepository.findById(1L)).thenReturn(Optional.of(pessoa));
        when(enderecoService.salvar(any(Endereco.class))).thenReturn(salvo);

        mockMvc.perform(post("/api/enderecos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10L));
    }

    @Test
    void deveRetornar400_QuandoPessoaNaoEnviada() throws Exception {
        String json = """
                {
                  "cep": "12345-678",
                  "bairro": "Centro",
                  "logradouro": "Rua A",
                  "numero": "100",
                  "complemento": "Casa",
                  "tipo": "faturamento",
                  "cidade": "São Paulo",
                  "estado": "SP"
                }
                """;

        mockMvc.perform(post("/api/enderecos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornar400_QuandoPessoaNaoExistir() throws Exception {
        String json = """
                {
                  "cep": "12345-678",
                  "bairro": "Centro",
                  "logradouro": "Rua A",
                  "numero": "100",
                  "complemento": "Casa",
                  "tipo": "faturamento",
                  "cidade": "São Paulo",
                  "estado": "SP",
                  "pessoa": { "id": 10 }
                }
                """;

        when(pessoaRepository.findById(10L)).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/enderecos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveAtualizarEndereco() throws Exception {
        Endereco atualizado = new Endereco();
        atualizado.setId(1L);

        when(enderecoService.atualizar(eq(1L), any())).thenReturn(atualizado);

        String json = """
                {
                  "cep": "12345-678",
                  "bairro": "Centro",
                  "logradouro": "Rua Nova",
                  "numero": "200",
                  "complemento": "Apto 2",
                  "tipo": "entrega",
                  "cidade": "Campinas",
                  "estado": "SP",
                  "pessoa": { "id": 1 }
                }
                """;

        mockMvc.perform(put("/api/enderecos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void deveRetornar404_QuandoAtualizarEnderecoInexistente() throws Exception {
        when(enderecoService.atualizar(eq(99L), any()))
                .thenThrow(new RuntimeException("Não encontrado"));

        mockMvc.perform(put("/api/enderecos/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isNotFound());
    }


    @Test
    void deveDeletarEndereco() throws Exception {
        mockMvc.perform(delete("/api/enderecos/3"))
                .andExpect(status().isNoContent());

        verify(enderecoService).deletar(3L);
    }
}
