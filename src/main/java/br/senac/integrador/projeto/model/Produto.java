package br.senac.integrador.projeto.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false)
    private Double avaliacao;

    @Column(nullable = false, length = 500)
    private String descricao;

    @Column(nullable = false)
    private Double preco;

    @Column(nullable = false)
    private Integer quantidadeEstoque;

    @Column(nullable = false, length = 20)
    private String status = "ATIVO";

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ProdutoImagem> imagens = new ArrayList<>();

    public Produto() {}

    public void addImagem(ProdutoImagem imagem) {
        imagens.add(imagem);
        imagem.setProduto(this);
    }

    public void removeImagem(ProdutoImagem imagem) {
        imagens.remove(imagem);
        imagem.setProduto(null);
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Double getAvaliacao() { return avaliacao; }
    public void setAvaliacao(Double avaliacao) { this.avaliacao = avaliacao; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }

    public Integer getQuantidadeEstoque() { return quantidadeEstoque; }
    public void setQuantidadeEstoque(Integer quantidadeEstoque) { this.quantidadeEstoque = quantidadeEstoque; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<ProdutoImagem> getImagens() { return imagens; }
    public void setImagens(List<ProdutoImagem> imagens) {
        this.imagens.clear();
        if (imagens != null) {
            imagens.forEach(this::addImagem);
        }
    }
}
