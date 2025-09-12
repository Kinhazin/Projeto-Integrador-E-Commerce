package br.senac.integrador.projeto.controller;

import br.senac.integrador.projeto.model.Pessoa; // suposição de que você tenha uma classe Pessoa
import br.senac.integrador.projeto.repository.PessoaRepository; // suposição do repositório
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired; // se usar Spring
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*; // para anotações REST

import java.util.List;

@Controller
@RequestMapping("/pessoashtml") 
public class PessoaControllerHtml {

    @Autowired
    private PessoaRepository pessoaRepository;

    @GetMapping
    public String listarPessoas(Model model) {
        List<Pessoa> pessoas = pessoaRepository.findAll();
        model.addAttribute("pessoas", pessoas);
        return "UsuariosAdm"; 
    }

}