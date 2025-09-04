package Model;

import java.math.BigDecimal;

/**
 * Representa a entidade Produto, com os dados correspondentes à tabela
 * 'produto' no banco de dados.
 */
public class Produto {

    private int id;
    private String nome;
    private double preco;

    public Produto(int id, String nome, double preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    // Métodos Getters para acessar os dados
    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public double getPreco() {
        return preco;
    }

    @Override
    public String toString() {
        return String.format("'%s' | preço=R$ %.2f", nome, preco);
    }
}
