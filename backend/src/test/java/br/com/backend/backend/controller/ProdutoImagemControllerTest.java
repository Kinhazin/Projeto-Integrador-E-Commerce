package br.com.backend.backend.controller;

import br.com.backend.backend.service.ProdutoImagemService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProdutoImagemController.class)
class ProdutoImagemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProdutoImagemService service;

    @Test
    @DisplayName("Deve deletar uma imagem e retornar 204")
    void testDeleteImagem() throws Exception {
        Long id = 1L;
        
        mockMvc.perform(delete("/api/imagens/{id}", id))
                .andExpect(status().isNoContent());

        verify(service, times(1)).deletarImagem(id);
    }

    @Test
    @DisplayName("Deve marcar imagem como principal e retornar 204")
    void testSetPrincipal() throws Exception {
        Long id = 2L;

        mockMvc.perform(patch("/api/imagens/{id}/principal", id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(service, times(1)).promoverOutraComoPrincipal(id);
    }
}
