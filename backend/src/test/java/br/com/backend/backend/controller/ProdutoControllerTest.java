package br.com.backend.backend.controller;

import br.com.backend.backend.model.Produto;
import br.com.backend.backend.repository.ProdutoRepository;
import br.com.backend.backend.service.ProdutosService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProdutoControllerTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private ProdutosService produtosService;

    @InjectMocks
    private ProdutoController produtoController;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(produtoController).build();
    }

    @Test
    void deveListarProdutos() throws Exception {
        Produto p = new Produto();
        p.setId(1L);
        p.setNome("Produto Teste");

        when(produtoRepository.findAll()).thenReturn(List.of(p));

        mockMvc.perform(get("/api/produtos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Produto Teste"));
    }

    @Test
    void deveCriarProdutoComUpload() throws Exception {

        MockMultipartFile imagemFake =
                new MockMultipartFile("imagens", "foto.png",
                        "image/png", "conteudo".getBytes());

        when(produtosService.salvarArquivo(any())).thenReturn("url/imagem.png");

        Produto salvo = new Produto();
        salvo.setId(1L);
        salvo.setNome("Produto OK");

        when(produtoRepository.save(any())).thenReturn(salvo);

        mockMvc.perform(multipart("/api/produtos")
                        .file(imagemFake)
                        .param("nome", "Produto OK")
                        .param("descricao", "Desc")
                        .param("preco", "9.9")
                        .param("avaliacao", "4.8")
                        .param("quantidadeEstoque", "10")
                        .param("status", "ativo"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void deveAtualizarProduto() throws Exception {
        Produto existente = new Produto();
        existente.setId(1L);
        existente.setNome("Antigo");

        when(produtoRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(produtoRepository.save(any())).thenReturn(existente);

        String json = """
            {
                "nome": "Novo",
                "avaliacao": 4.5,
                "descricao": "Atualizado",
                "preco": 100.0,
                "quantidadeEstoque": 5,
                "status": "ativo"
            }
        """;

        mockMvc.perform(put("/api/produtos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void deveAlternarStatusProduto() throws Exception {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setStatus("ativo");

        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(produtoRepository.save(any())).thenReturn(produto);

        mockMvc.perform(patch("/api/produtos/1/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("inativo"));
    }

    @Test
    void deveAdicionarImagens() throws Exception {
        Produto produto = new Produto();
        produto.setId(1L);

        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(produtoRepository.save(any())).thenReturn(produto);
        when(produtosService.salvarArquivo(any())).thenReturn("url/imagem.png");

        MockMultipartFile imagemFake =
                new MockMultipartFile("imagens", "foto.png",
                        "image/png", "conteudo".getBytes());

        mockMvc.perform(multipart("/api/produtos/com-imagens/1/adicionar")
                        .file(imagemFake))
                .andExpect(status().isOk());
    }

    @Test
    void deveBuscarPorId() throws Exception {
        Produto p = new Produto();
        p.setId(1L);

        when(produtoRepository.findById(1L)).thenReturn(Optional.of(p));

        mockMvc.perform(get("/api/produtos/{id}", 1)
                        .param("id", "1"))
                .andExpect(status().isOk());
    }

    @Test
    void deveBuscarPorPessoa() throws Exception {
        when(produtoRepository.buscarPorIdPessoa(10L)).thenReturn(List.of(new Produto()));

        mockMvc.perform(get("/api/produtos/por-pessoa/10"))
                .andExpect(status().isOk());
    }
}
