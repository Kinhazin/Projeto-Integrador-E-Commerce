package br.com.backend.backend.controller;

import br.com.backend.backend.model.Endereco;
import br.com.backend.backend.model.Pessoa;
import br.com.backend.backend.service.EnderecoService;
import br.com.backend.backend.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {

    @Autowired
    private EnderecoService enderecoService;

    @Autowired
    private PessoaRepository pessoaRepository;

    @GetMapping
    public List<Endereco> listarTodos() {
        return enderecoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Endereco> buscarPorId(@PathVariable Long id) {
        return enderecoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/por-pessoa/{pessoaId}")
    public ResponseEntity<List<Endereco>> listarPorPessoaId(@PathVariable Long pessoaId) {
        Optional<Pessoa> pessoaOpt = pessoaRepository.findById(pessoaId);
        if (pessoaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        List<Endereco> enderecos = enderecoService.buscarPorPessoaId(pessoaId);
        return ResponseEntity.ok(enderecos);
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Endereco endereco) {
        if (endereco.getPessoa() == null || endereco.getPessoa().getId() == null) {
            return ResponseEntity.badRequest().body("Campo pessoa_id é obrigatório.");
        }

        Optional<Pessoa> pessoaOpt = pessoaRepository.findById(endereco.getPessoa().getId());
        if (pessoaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Pessoa não encontrada.");
        }

        endereco.setPessoa(pessoaOpt.get());
        Endereco novoEndereco = enderecoService.salvar(endereco);
        return ResponseEntity.ok(novoEndereco);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Endereco> atualizar(@PathVariable Long id, @RequestBody Endereco enderecoAtualizado) {
        System.out.println(enderecoAtualizado);
        try {
            Endereco endereco = enderecoService.atualizar(id, enderecoAtualizado);
            return ResponseEntity.ok(endereco);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        enderecoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
