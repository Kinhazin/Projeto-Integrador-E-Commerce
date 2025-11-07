package br.com.backend.backend.model;

public class RespostaPedido {

    private String numeroPedido;
    private Double total;
    private String mensagem;

    public RespostaPedido(String numeroPedido, Double total, String mensagem) {
        this.numeroPedido = numeroPedido;
        this.total = total;
        this.mensagem = mensagem;
    }

    // Getters e Setters
    public String getNumeroPedido() {
        return numeroPedido;
    }

    public void setNumeroPedido(String numeroPedido) {
        this.numeroPedido = numeroPedido;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
}
