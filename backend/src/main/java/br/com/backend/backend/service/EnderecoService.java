package br.com.backend.backend.service;

import br.com.backend.backend.model.Endereco;
import br.com.backend.backend.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    public List<Endereco> listarTodos() {
        return enderecoRepository.findAll();
    }

    public Optional<Endereco> buscarPorId(Long id) {
        return enderecoRepository.findById(id);
    }

    public List<Endereco> buscarPorPessoaId(Long pessoaId) {
        return enderecoRepository.findByPessoaId(pessoaId);
    }

    public Endereco salvar(Endereco endereco) {
        return enderecoRepository.save(endereco);
    }

    public Endereco atualizar(Long id, Endereco enderecoAtualizado) {
        return enderecoRepository.findById(id).map(endereco -> {
            endereco.setCep(enderecoAtualizado.getCep());
            endereco.setBairro(enderecoAtualizado.getBairro());
            endereco.setLogradouro(enderecoAtualizado.getLogradouro());
            endereco.setNumero(enderecoAtualizado.getNumero());
            endereco.setComplemento(enderecoAtualizado.getComplemento());
            endereco.setCidade(enderecoAtualizado.getCidade());
            endereco.setEstado(enderecoAtualizado.getEstado());
            endereco.setPessoa(enderecoAtualizado.getPessoa());
            endereco.setTipo(endereco.getTipo());
            return enderecoRepository.save(endereco);
        }).orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
    }

    public void deletar(Long id) {
        enderecoRepository.deleteById(id);
    }
}