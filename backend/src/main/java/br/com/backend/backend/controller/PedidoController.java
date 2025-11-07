package br.com.backend.backend.controller;

import br.com.backend.backend.model.ItemPedido;
import br.com.backend.backend.model.Pedido;
import br.com.backend.backend.model.RespostaPedido;
import br.com.backend.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<RespostaPedido> criarPedido(@RequestBody Pedido pedido) {
        try {
            Pedido salvo = pedidoService.criarPedidoComItens(pedido);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new RespostaPedido(
                            salvo.getNumeroPedido(),
                            salvo.getValorTotal(),
                            "Pedido criado com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RespostaPedido(null, null, "Erro ao criar pedido: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoService.buscarPorId(id);
        return pedido
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pedido não encontrado"));
    }

    @GetMapping("/por-pessoa/{pessoaId}")
    public ResponseEntity<?> buscarPorPessoa(@PathVariable Long pessoaId) {
        List<Pedido> pedidos = pedidoService.buscarPorPessoaId(pessoaId);
        if (pedidos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum pedido encontrado para essa pessoa");
        }
        return ResponseEntity.ok(pedidos);
    }
}
