package br.com.backend.backend.controller;

import br.com.backend.backend.model.ItemPedido;
import br.com.backend.backend.model.Pedido;
import br.com.backend.backend.model.RespostaPedido;
import br.com.backend.backend.service.PedidoService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@ExtendWith(SpringExtension.class)
@WebMvcTest(PedidoController.class)
public class PedidoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PedidoService pedidoService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void deveCriarPedidoComSucesso() throws Exception {

        Pedido pedido = new Pedido();
        pedido.setId(1L);
        pedido.setNumeroPedido("PED123");
        pedido.setValorTotal(150.0);
        pedido.setDataCriacao(LocalDateTime.now());

        Mockito.when(pedidoService.criarPedidoComItens(any(Pedido.class)))
               .thenReturn(pedido);

        mockMvc.perform(post("/api/pedidos/criar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pedido)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numeroPedido").value("PED123"))
                .andExpect(jsonPath("$.valorTotal").value(150.0))
                .andExpect(jsonPath("$.mensagem").value("Pedido criado com sucesso!"));
    }

    @Test
    void deveBuscarPedidoPorId() throws Exception {

        Pedido pedido = new Pedido();
        pedido.setId(1L);
        pedido.setNumeroPedido("PED999");
        pedido.setValorTotal(250.0);

        Mockito.when(pedidoService.buscarPorId(1L))
                .thenReturn(Optional.of(pedido));

        mockMvc.perform(get("/api/pedidos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numeroPedido").value("PED999"))
                .andExpect(jsonPath("$.valorTotal").value(250.0));
    }

    @Test
    void deveRetornar404QuandoPedidoNaoExiste() throws Exception {

        Mockito.when(pedidoService.buscarPorId(1L))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/pedidos/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Pedido não encontrado"));
    }

    @Test
    void deveBuscarPedidosPorPessoa() throws Exception {

        Pedido pedido = new Pedido();
        pedido.setId(1L);
        pedido.setNumeroPedido("PED777");
        pedido.setValorTotal(300.0);

        Mockito.when(pedidoService.buscarPorPessoaId(5L))
                .thenReturn(Collections.singletonList(pedido));

        mockMvc.perform(get("/api/pedidos/por-pessoa/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].numeroPedido").value("PED777"));
    }

    @Test
    void deveRetornar404QuandoPessoaNaoTemPedidos() throws Exception {

        Mockito.when(pedidoService.buscarPorPessoaId(5L))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/pedidos/por-pessoa/5"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Nenhum pedido encontrado para essa pessoa"));
    }
}
