package BancoDeDados;

import Model.Usuario; // Importa a classe Usuario
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class PessoaDAO {

    public List<Usuario> buscarTodos() {
        String sql = "SELECT id, nome, cpf, email, senha, status, grupo FROM pessoas ORDER BY nome";

        List<Usuario> usuariosEncontrados = new ArrayList<>();

        try (Connection conexao = ConexaoMysql.getConexao(); PreparedStatement stmt = conexao.prepareStatement(sql); ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                int id = rs.getInt("id");
                String nome = rs.getString("nome");
                String cpf = rs.getString("cpf");
                String email = rs.getString("email");
                String senha = rs.getString("senha");
                String status = rs.getString("status");
                String grupo = rs.getString("grupo");

                Usuario usuario = new Usuario(id, nome, cpf, email, senha, status, grupo);
                usuariosEncontrados.add(usuario);
            }

        } catch (SQLException e) {
            System.err.println("Erro ao buscar usuários: " + e.getMessage());
            e.printStackTrace();
        }

        return usuariosEncontrados;
    }

    public boolean cpfJaExiste(String cpf) {
        String sql = "SELECT 1 FROM pessoas WHERE cpf = ?";
        try (Connection conexao = ConexaoMysql.getConexao(); PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, cpf);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return true;
        }
    }

    public boolean emailJaExiste(String email) {
        String sql = "SELECT 1 FROM pessoas WHERE email = ?";
        try (Connection conexao = ConexaoMysql.getConexao(); PreparedStatement stmt = conexao.prepareStatement(sql)) {
            stmt.setString(1, email);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return true;
        }
    }

    public boolean inserir(Usuario usuario) {
        String sql = "INSERT INTO pessoas (nome, cpf, email, senha, status, grupo) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conexao = ConexaoMysql.getConexao(); PreparedStatement stmt = conexao.prepareStatement(sql)) {

            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getCpf());
            stmt.setString(3, usuario.getEmail());
            stmt.setString(4, usuario.getSenha());
            stmt.setString(5, usuario.getStatus());
            stmt.setString(6, usuario.getGrupo());

            int linhasAfetadas = stmt.executeUpdate();
            return linhasAfetadas > 0;

        } catch (SQLException e) {
            System.err.println("Erro ao inserir usuário: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public Usuario buscarPorId(int id) {
        String sql = "SELECT id, nome, cpf, email, senha, status, grupo FROM pessoas WHERE id = ?";
        Usuario usuario = null;

        try (Connection conexao = ConexaoMysql.getConexao(); PreparedStatement stmt = conexao.prepareStatement(sql)) {

            stmt.setInt(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String nome = rs.getString("nome");
                    String cpf = rs.getString("cpf");
                    String email = rs.getString("email");
                    String senha = rs.getString("senha");
                    String status = rs.getString("status");
                    String grupo = rs.getString("grupo");

                    usuario = new Usuario(id, nome, cpf, email, senha, status, grupo);
                }
            }
        } catch (SQLException e) {
            System.err.println("Erro ao buscar usuário por ID: " + e.getMessage());
            e.printStackTrace();
        }
        return usuario;
    }

    public boolean atualizar(Usuario usuario) {

        String sql = "UPDATE pessoas SET nome = ?, cpf = ?, grupo = ? WHERE id = ?";

        try (Connection conexao = ConexaoMysql.getConexao(); PreparedStatement stmt = conexao.prepareStatement(sql)) {

            stmt.setString(1, usuario.getNome());
            stmt.setString(2, usuario.getCpf());
            stmt.setString(3, usuario.getGrupo());
            stmt.setInt(4, usuario.getId());

            int linhasAfetadas = stmt.executeUpdate();
            return linhasAfetadas > 0;

        } catch (SQLException e) {
            System.err.println("Erro ao atualizar usuário: " + e.getMessage());
            e.printStackTrace();

            return false;

        }

    }
}
