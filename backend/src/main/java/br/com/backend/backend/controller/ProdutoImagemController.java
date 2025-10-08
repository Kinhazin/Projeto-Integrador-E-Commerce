package br.com.backend.backend.controller;

import br.com.backend.backend.service.ProdutoImagemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/imagens")
public class ProdutoImagemController {

    private final ProdutoImagemService service;

    public ProdutoImagemController(ProdutoImagemService service) {
        this.service = service;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long imagemId) {
        service.deletarImagem(imagemId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/principal")
    public ResponseEntity<Void> setPrincipal(@PathVariable("id") Long imagemId) {
        service.promoverOutraComoPrincipal(imagemId);
        return ResponseEntity.noContent().build();

    }

}