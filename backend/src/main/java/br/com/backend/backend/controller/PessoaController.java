package br.com.backend.backend.controller;

import br.com.backend.backend.model.Pessoa;
import br.com.backend.backend.repository.PessoaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.backend.backend.service.PessoaService;

import java.util.List;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private PessoaService pessoaService;

    @GetMapping
    public List<Pessoa> listarPessoas() {
        return pessoaRepository.findAll();
    }

    @PostMapping
    public Pessoa adicionarPessoa(@RequestBody Pessoa pessoa) {
        return pessoaService.salvar(pessoa);
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String senha) {
        Pessoa pessoa = pessoaService.login(email, senha);

        if (pessoa == null) {
            return ResponseEntity.status(401).body("Usuário ou senha inválidos");
        }

        return ResponseEntity.ok(pessoa);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> alterarStatus(@PathVariable Long id) {
        return pessoaRepository.findById(id)
                .map(pessoa -> {
                    String novoStatus = pessoa.getStatus().equalsIgnoreCase("ativo") ? "inativo" : "ativo";
                    pessoa.setStatus(novoStatus);
                    pessoaRepository.save(pessoa);
                    return ResponseEntity.ok("Status atualizado para: " + novoStatus);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Pessoa atualizarPessoa(@PathVariable Long id, @RequestBody Pessoa pessoaAtualizada) {
        return pessoaRepository.findById(id)
                .map(pessoa -> {
                    pessoa.setNome(pessoaAtualizada.getNome());
                    pessoa.setCpf(pessoaAtualizada.getCpf());
                    pessoa.setSenha(pessoaAtualizada.getSenha());
                    pessoa.setGrupo(pessoaAtualizada.getGrupo());
                    return pessoaRepository.save(pessoa);
                })
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada com id: " + id));
    }

}