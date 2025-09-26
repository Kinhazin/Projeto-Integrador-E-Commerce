package br.senac.integrador.projeto.controller;

import br.senac.integrador.projeto.model.Pessoa; // suposição de que você tenha uma classe Pessoa
import br.senac.integrador.projeto.repository.PessoaRepository; // suposição do repositório

import org.springframework.beans.factory.annotation.Autowired; // se usar Spring
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // para anotações REST

import java.util.List;

@RestController // Falando que esse controller é RestFull, ou seja, não renderiza páginas.
@RequestMapping("/pessoas") // Passando o meio de acesso para minha requisição
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