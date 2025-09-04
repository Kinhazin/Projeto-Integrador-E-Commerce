package BancoDeDados;

import Model.Produto;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ProdutoDAO {

    public List<Produto> buscarTodos() {
        String sql = "SELECT id, nome, preço FROM produto ORDER BY nome";

        List<Produto> produtosEncontrados = new ArrayList<>();

        try (Connection conexao = ConexaoMysql.getConexao(); PreparedStatement stmt = conexao.prepareStatement(sql); ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                int id = rs.getInt("id");
                String nome = rs.getString("nome");
                double preco = rs.getDouble("preço");

                Produto produto = new Produto(id, nome, preco);

                produtosEncontrados.add(produto);
            }

        } catch (SQLException e) {
            System.err.println("Erro ao buscar produtos: " + e.getMessage());
            e.printStackTrace();
        }

        return produtosEncontrados;
    }
}
