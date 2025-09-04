package Model;

public class Usuario {

    private int id;
    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private String status;
    private String grupo;

    public Usuario(int id, String nome, String cpf, String email, String senha, String status, String grupo) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.status = status;
        this.grupo = grupo;
    }

    public Usuario(String nome, String cpf, String email, String senha, String status, String grupo) {
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.status = status;
        this.grupo = grupo;
    }

    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCpf() {
        return cpf;
    }

    public String getEmail() {
        return email;
    }

    public String getStatus() {
        return status;
    }

    public String getGrupo() {
        return grupo;
    }

    public String getSenha() {
        return senha;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    @Override
    public String toString() {
        return String.format("id=%d | nome='%s' | email='%s' | status='%s' | grupo='%s'",
                id, nome, email, status, grupo);
    }
}
