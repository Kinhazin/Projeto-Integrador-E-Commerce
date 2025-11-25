package br.com.backend.backend.service;

import br.com.backend.backend.model.ItemPedido;
import br.com.backend.backend.model.Pedido;
import br.com.backend.backend.repository.ItemPedidoRepository;
import br.com.backend.backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    // Salva pedido com itens
    public Pedido criarPedidoComItens(Pedido pedido) {
        pedido.setStatus("aguardando pagamento");
        pedido.setDataCriacao(LocalDateTime.now());

        String numeroPedido = gerarNumeroPedido();
        pedido.setNumeroPedido(numeroPedido);

        if (pedido.getValorTotal() == null)
            pedido.setValorTotal(0.0);
        if (pedido.getFrete() == null)
            pedido.setFrete(0.0);

        // Salva o pedido
        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        // Salva os itens associados
        List<ItemPedido> itens = pedido.getItens();
        if (itens != null) {
            for (ItemPedido item : itens) {
                item.setPedido(pedidoSalvo);
                itemPedidoRepository.save(item);
            }
        }

        return pedidoSalvo;
    }

    public List<Pedido> buscarPorPessoaId(Long pessoaId) {
        return pedidoRepository.findByPessoaId(pessoaId);
    }

    public Optional<Pedido> buscarPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    private String gerarNumeroPedido() {
        long count = pedidoRepository.count() + 1;
        return String.format("PED-%05d", count);
    }
}
