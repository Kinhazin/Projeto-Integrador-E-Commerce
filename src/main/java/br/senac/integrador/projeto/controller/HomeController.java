package br.senac.integrador.projeto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "index"; // Isso vai procurar o index.html em templates
    }

    @GetMapping("/aplicacao")
    public String aplicacao() {
        return "aplicacao";
    }

    @GetMapping("/usuarios")
    public String usuarios() {
        return "UsuariosAdm";
    }
}
