package br.com.backend.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.backend.backend.model.ItemPedido;
import br.com.backend.backend.service.ItemPedidoService;

@RestController
@RequestMapping("/api/itens-pedido")
public class ItemPedidoController {

    @Autowired
    private ItemPedidoService itemPedidoService;

    @GetMapping("/por-pedido/{pedidoId}")
    public ResponseEntity<List<ItemPedido>> buscarPorPedido(@PathVariable Long pedidoId) {
        List<ItemPedido> itens = itemPedidoService.buscarItensPorPedido(pedidoId);
        if (itens.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(itens);
    }
}