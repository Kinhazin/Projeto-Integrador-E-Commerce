/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Aplicacao;

import BancoDeDados.Autenticador;
import BancoDeDados.PessoaDAO;
import BancoDeDados.ProdutoDAO;
import Model.Produto;
import Model.Usuario;
import service.Criptografia;
import utils.ValidarCPF;
import java.util.List;
import java.util.Scanner;

public class Programa {

    static Scanner input = new Scanner(System.in);

    public static boolean escolha(String texto) {
        String escolha;
        do {
            System.out.print(texto);
            escolha = input.nextLine();
        } while (!escolha.replaceAll(" ", "").equals("1") && !escolha.replaceAll(" ", "").equals("2"));
        if (escolha.replaceAll(" ", "").equals("1")) {
            return true;
        }
        return false;
    }

    public static boolean logarOuCadastrar() {
        return Programa.escolha("\n-- BEM VINDO A LOJA VIRTUAL --\n[1] Entrar | [2] Cadastrar-se\nEscolha:");
    }

    public static String logar() throws Exception {
        System.out.print("\nE-mail: ");
        String email = input.nextLine();
        System.out.print("Senha: ");
        String senha = input.nextLine();

        Criptografia.valor = senha;
        senha = Criptografia.criptografar();
        if (Autenticador.autenticar(email.replaceAll(" ", ""), senha.replaceAll(" ", ""))) {
            return Autenticador.verificarGrupo(email, senha);
        }
        ;
        return "falso";
    }

    public static void listaProdutos() {
        ProdutoDAO produtoDao = new ProdutoDAO();
        List<Produto> listaDeProdutos = produtoDao.buscarTodos();

        if (listaDeProdutos.isEmpty()) {
            System.out.println("Nenhum produto encontrado no banco de dados.");
        } else {
            System.out.println("\n--- LISTA DE PRODUTOS CADASTRADOS ---");
            System.out.println("-------------------------------------------------------------------------------------");
            System.out.printf("%-5s | %-35s | %-15s | %-10s%n", "ID", "NOME DO PRODUTO", "PREÇO (R$)", "ESTOQUE");
            System.out.println("-------------------------------------------------------------------------------------");

            for (Produto produto : listaDeProdutos) {
                // Assumindo que a classe Produto tem os métodos getId, getNome, getPreco e
                // getEstoque.
                System.out.printf("%-5d | %-35s | R$ %-12.2f |",
                        produto.getId(),
                        produto.getNome(),
                        produto.getPreco());
            }
            System.out.println("-------------------------------------------------------------------------------------");
        }
    }

    public static void listaUsuarios() {
        PessoaDAO usuarioDao = new PessoaDAO();
        List<Usuario> listaDeUsuarios = usuarioDao.buscarTodos();

        if (listaDeUsuarios.isEmpty()) {
            System.out.println("Nenhum usuário encontrado no banco de dados.");
        } else {
            System.out.println("\n--- LISTA DE USUÁRIOS CADASTRADOS ---");
            System.out.println("---------------------------------------------------------------------------------");
            System.out.printf("%-5s | %-25s | %-30s | %-10s%n", "ID", "NOME", "E-MAIL", "GRUPO");
            System.out.println("---------------------------------------------------------------------------------");

            for (Usuario usuario : listaDeUsuarios) {
                System.out.printf("%-5d | %-25s | %-30s | %-10s%n",
                        usuario.getId(),
                        usuario.getNome(),
                        usuario.getEmail(),
                        usuario.getGrupo());
            }
            System.out.println("---------------------------------------------------------------------------------");
        }
    }

    public static int lerEscolhaMenu(String texto, int maxOpcoes) {
        int opcao;
        while (true) {
            System.out.print(texto);
            String entradaDoUsuario = input.nextLine().trim();
            try {
                opcao = Integer.parseInt(entradaDoUsuario);
                if (opcao >= 1 && opcao <= maxOpcoes) {
                    return opcao;
                } else {
                    System.out.println("Opção inválida. Por favor, digite um número entre 1 e " + maxOpcoes + ".");
                }
            } catch (NumberFormatException e) {
                System.out.println("Entrada inválida. Por favor, digite um número.");
            }
        }
    }

    public static Scanner getScanner() {
        return input;
    }
}
