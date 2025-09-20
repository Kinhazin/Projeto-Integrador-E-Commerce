package br.senac.integrador.projeto.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "produto_imagens")
public class ProdutoImagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(length = 200)
    private String legenda;

    @Column(nullable = false)
    private Integer ordem = 0;

    @Column(nullable = false)
    private Boolean principal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    @JsonBackReference
    private Produto produto;

    public ProdutoImagem() {}

    public ProdutoImagem(String url, String legenda, Integer ordem, Boolean principal) {
        this.url = url;
        this.legenda = legenda;
        this.ordem = ordem != null ? ordem : 0;
        this.principal = principal != null ? principal : false;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getLegenda() { return legenda; }
    public void setLegenda(String legenda) { this.legenda = legenda; }
    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }
    public Boolean getPrincipal() { return principal; }
    public void setPrincipal(Boolean principal) { this.principal = principal; }
    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }
}
