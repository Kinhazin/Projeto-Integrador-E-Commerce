package br.com.backend.backend.controller;

import br.com.backend.backend.model.ItemPedido;
import br.com.backend.backend.service.ItemPedidoService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ItemPedidoController.class)
public class ItemPedidoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ItemPedidoService itemPedidoService;

    @Test
    void deveRetornarItensDoPedido() throws Exception {
        ItemPedido item = new ItemPedido();
        item.setProdutoId(10L);
        item.setQuantidade(2);
        item.setPrecoUnitario(50.0);

        Mockito.when(itemPedidoService.buscarItensPorPedido(1L))
                .thenReturn(List.of(item));

        mockMvc.perform(get("/api/itens-pedido/por-pedido/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].produtoId").value(10))
                .andExpect(jsonPath("$[0].quantidade").value(2));
    }

    @Test
    void deveRetornarNoContentQuandoNaoExistirItens() throws Exception {

        Mockito.when(itemPedidoService.buscarItensPorPedido(1L))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/itens-pedido/por-pedido/1"))
                .andExpect(status().isNoContent());
    }
}
