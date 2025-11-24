package br.com.backend.backend.controller;

import br.com.backend.backend.model.Pessoa; 
import br.com.backend.backend.repository.PessoaRepository; 

import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; 

import java.util.List;

@RestController 
@RequestMapping("/api/pessoas") 
public class PessoaController {

    @Autowired
    private PessoaRepository pessoaRepository;

    @GetMapping
    public List<Pessoa> listarPessoas() {
        return pessoaRepository.findAll();
    }

    @PostMapping
    public Pessoa adicionarPessoa(@RequestBody Pessoa pessoa) {
        return pessoaRepository.save(pessoa);
    }

    @GetMapping("/buscar")
    public List<Pessoa> buscarPorNomeESenha(@RequestParam String email, @RequestParam String senha) {
        return pessoaRepository.findByEmailAndSenha(email, senha);
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