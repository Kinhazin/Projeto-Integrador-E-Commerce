package br.com.backend.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.backend.backend.model.Pessoa;
import br.com.backend.backend.repository.PessoaRepository;

@Service
public class PessoaService {

    private final PessoaRepository repository;
    private final PasswordService passwordService;

    public PessoaService(PessoaRepository repository, PasswordService passwordService) {
        this.repository = repository;
        this.passwordService = passwordService;
    }

    public Pessoa salvar(Pessoa pessoa) {
        // Criptografa apenas se ainda estiver em texto puro
        if (!pessoa.getSenha().startsWith("$2a$")) { // BCrypt sempre começa assim
            pessoa.setSenha(passwordService.encrypt(pessoa.getSenha()));
        }

        return repository.save(pessoa);
    }

    public Pessoa login(String email, String senha) {

        // 1° tenta login pelo jeito ANTIGO (texto puro)
        List<Pessoa> lista = repository.findByEmailAndSenha(email, senha);

        if (!lista.isEmpty()) {
            Pessoa p = lista.get(0);

            // Após login bem sucedido, converte para hash
            p.setSenha(passwordService.encrypt(senha));
            repository.save(p);

            return p;
        }

        // 2° tenta login pelo jeito NOVO (BCrypt)
        Pessoa pessoa = repository.findByEmail(email);

        if (pessoa != null && passwordService.matches(senha, pessoa.getSenha())) {
            return pessoa;
        }

        return null; // login falhou
    }
}
