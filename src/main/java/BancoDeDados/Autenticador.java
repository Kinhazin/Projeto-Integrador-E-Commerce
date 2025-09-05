package BancoDeDados;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Autenticador {

    public static boolean autenticar(String email, String senha) {
        String querry = "SELECT 1 FROM pessoas WHERE email = ? AND senha = ?";

        try (Connection conexao = ConexaoMysql.getConexao(); PreparedStatement subst = conexao.prepareStatement(querry)) {

            subst.setString(1, email);
            subst.setString(2, senha);

            

            try (ResultSet rs = subst.executeQuery()) {
                if (!rs.next()) {
                    System.out.println("USUÁRIO NÃO CADASTRADO");

                    return false;
                }
                return true;
            }

        } catch (SQLException e) {
            System.err.println("Ocorreu um erro ao tentar autenticar o usuário.");
            e.printStackTrace();
            return false;
        }
    }

    public static String verificarGrupo(String email, String senha) {
        String sql = "SELECT grupo FROM pessoas WHERE email = ? AND senha = ?";

        try (Connection conexao = ConexaoMysql.getConexao(); PreparedStatement stmt = conexao.prepareStatement(sql)) {

            stmt.setString(1, email);
            stmt.setString(2, senha);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("grupo");
                }
            }
        } catch (SQLException e) {
            System.err.println("Ocorreu um erro ao verificar o grupo do usuário.");
            e.printStackTrace();
        }

        // Retorna null se o usuário não foi encontrado ou se deu algum erro
        return null;
    }
}
