package br.com.backend.backend.repository;

import br.com.backend.backend.model.ItemPedido;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
    List<ItemPedido> findByPedidoId(Long pedidoId);

}
