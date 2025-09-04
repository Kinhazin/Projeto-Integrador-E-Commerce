package BancoDeDados;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Fábrica de conexões com o banco de dados MySQL 'e-commerce'.
 */
public class ConexaoMysql {

    private static final String URL = "jdbc:mysql://localhost:3306/e-commerce";
    private static final String USUARIO = "root";
    private static final String SENHA = "1234";

    public static Connection getConexao() throws SQLException {
        // Tenta estabelecer a conexão usando o driver JDBC do MySQL
        return DriverManager.getConnection(URL, USUARIO, SENHA);
    }

    public static void main(String[] args) {
        // O 'try-with-resources' garante que a conexão será fechada automaticamente.
        try (Connection conexao = ConexaoMysql.getConexao()) {

            System.out.println("Conexão com o banco de dados 'e-commerce' estabelecida com sucesso!");

        } catch (SQLException e) {
            System.err.println("Falha ao conectar com o banco de dados: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
