package service;

import Aplicacao.Programa;
import BancoDeDados.PessoaDAO;
import Model.Usuario;
import utils.ValidarCPF;
import java.util.Scanner;
import service.Criptografia;

public class UsuarioService {

    public static void cadastrarNovoUsuario(Scanner scanner) throws Exception {
        PessoaDAO usuarioDAO = new PessoaDAO();

        System.out.println("\n--- CADASTRO DE NOVO USUÁRIO ---");

        System.out.print("Nome completo: ");
        String nome = scanner.nextLine();

        String email;
        while (true) {
            System.out.print("E-mail: ");
            email = scanner.nextLine().trim();
            if (usuarioDAO.emailJaExiste(email)) {
                System.out.println("❌ Este e-mail já está em uso. Por favor, utilize outro.");
            } else {
                break;
            }
        }

        String cpf;
        while (true) {
            System.out.print("CPF (apenas números ou formato xxx.xxx.xxx-xx): ");
            cpf = scanner.nextLine();
            if (!ValidarCPF.isValido(cpf)) {
                System.out.println("CPF inválido. Verifique os dígitos.");
            } else if (usuarioDAO.cpfJaExiste(cpf.replaceAll("[^0-9]", ""))) {
                System.out.println("Este CPF já está cadastrado.");
            } else {
                cpf = cpf.replaceAll("[^0-9]", "");
                break;
            }
        }

        String senha;
        while (true) {
            System.out.print("Crie uma senha: ");
            senha = scanner.nextLine();
            System.out.print("Confirme a senha: ");
            String confirmacaoSenha = scanner.nextLine();

            if (senha.equals(confirmacaoSenha)) {
                if (senha.isEmpty()) {
                    System.out.println("A senha não pode estar em branco.");
                } else {
                    Criptografia.valor = senha;
                     senha = Criptografia.criptografar();
                    break;
                }
            } else {
                System.out.println("As senhas não coincidem. Tente novamente.");
            }
        }

        String status = "ATIVO";
        String grupo = "USUARIO";

        Usuario novoUsuario = new Usuario(nome, cpf, email, senha, status, grupo);

        if (usuarioDAO.inserir(novoUsuario)) {
            System.out.println("\nUsuário cadastrado com sucesso!");
            System.out.println("Faça o login para continuar.");
        } else {
            System.out.println("\nOcorreu um erro ao realizar o cadastro. Tente novamente mais tarde.");
        }
    }

    public static void cadastrarUsuarioPeloAdmin(Scanner scanner) throws Exception {
        PessoaDAO usuarioDAO = new PessoaDAO();

        System.out.println("\n--- CADASTRO DE NOVO USUÁRIO (ADMIN) ---");
        System.out.print("Nome completo do novo usuário: ");
        String nome = scanner.nextLine();

        String email;
        while (true) {
            System.out.print("E-mail: ");
            email = scanner.nextLine().trim();
            if (usuarioDAO.emailJaExiste(email)) {
                System.out.println("Este e-mail já está em uso. Por favor, utilize outro.");
            } else {
                break;
            }
        }

        String cpf;
        while (true) {
            System.out.print("CPF (formato xxx.xxx.xxx-xx): ");
            cpf = scanner.nextLine();
            if (!ValidarCPF.isValido(cpf)) {
                System.out.println("CPF inválido. Verifique os dígitos.");
            } else if (usuarioDAO.cpfJaExiste(cpf.replaceAll("[^0-9]", ""))) {
                System.out.println("Este CPF já está cadastrado.");
            } else {
                cpf = cpf.replaceAll("[^0-9]", ""); // Guarda apenas os números
                break;
            }
        }

        System.out.print("Crie uma senha temporária para o usuário: ");
        String senha = scanner.nextLine();
        senha = Criptografia.criptografar();
        String grupo;
        while (true) {
            System.out.print("Defina o grupo do usuário ([1] USUARIO | [2] ADMINISTRADOR): ");
            String escolhaGrupo = scanner.nextLine().trim();
            if ("1".equals(escolhaGrupo)) {
                grupo = "USUARIO";
                break;
            } else if ("2".equals(escolhaGrupo)) {
                grupo = "ADMINISTRADOR";
                break;
            } else {
                System.out.println("Opção inválida. Escolha 1 ou 2.");
            }
        }

        String status;
        while (true) {
            System.out.print("Defina o status do usuário ([1] ATIVO | [2] INATIVO): ");
            String escolhaStatus = scanner.nextLine().trim();
            if ("1".equals(escolhaStatus)) {
                status = "ATIVO";
                break;
            } else if ("2".equals(escolhaStatus)) {
                status = "INATIVO";
                break;
            } else {
                System.out.println("Opção inválida. Escolha 1 ou 2.");
            }
        }

        Usuario novoUsuario = new Usuario(nome, cpf, email, senha, status, grupo);

        if (usuarioDAO.inserir(novoUsuario)) {
            System.out.println("\nNovo usuário '" + nome + "' cadastrado com sucesso!");
        } else {
            System.out.println("\nOcorreu um erro ao realizar o cadastro.");
        }
    }

    public static void editarUsuarioPeloAdmin(Scanner scanner) {
        PessoaDAO usuarioDAO = new PessoaDAO();
        Programa.listaUsuarios();

        System.out.println("\n--- EDIÇÃO DE USUÁRIO (ADMIN) ---");
        System.out.print("Digite o ID do usuário que deseja editar: ");
        int id;
        try {
            id = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("ID inválido. Por favor, insira um número.");
            return;
        }

        Usuario usuario = usuarioDAO.buscarPorId(id);

        if (usuario == null) {
            System.out.println("Usuário com ID " + id + " não encontrado.");
            return;
        }

        System.out.println("\nEditando usuário: " + usuario.getNome());
        System.out.println("Deixe o campo em branco e pressione Enter para manter o valor atual.");

        System.out.print("Nome [" + usuario.getNome() + "]: ");
        String nome = scanner.nextLine();
        if (!nome.trim().isEmpty()) {
            usuario.setNome(nome);
        }
        while (true) {
            System.out.print("CPF [" + usuario.getCpf() + "]: ");
            String cpfInput = scanner.nextLine();
            String cpfFormatado = cpfInput.replaceAll("[^0-9]", "");

            if (cpfInput.trim().isEmpty()) {
                break;
            }

            if (!ValidarCPF.isValido(cpfInput)) {
                System.out.println("CPF inválido. Verifique os dígitos.");
            } else if (usuarioDAO.cpfJaExiste(cpfFormatado) && !cpfFormatado.equals(usuario.getCpf())) {
                System.out.println("Este CPF já está cadastrado em outro usuário.");
            } else {
                usuario.setCpf(cpfFormatado); // Salva o CPF apenas com números
                break;
            }
        }

        while (true) {
            System.out.print("Grupo ([1] USUARIO | [2] ADMINISTRADOR) [" + usuario.getGrupo() + "]: ");
            String escolhaGrupo = scanner.nextLine().trim();

            if (escolhaGrupo.isEmpty()) {
                break;
            }

            if ("1".equals(escolhaGrupo)) {
                usuario.setGrupo("USUARIO");
                break;
            } else if ("2".equals(escolhaGrupo)) {
                usuario.setGrupo("ADMINISTRADOR");
                break;
            } else {
                System.out.println("❌ Opção inválida. Escolha 1 ou 2.");
            }
        }

        if (usuarioDAO.atualizar(usuario)) {
            System.out.println("\nUsuário '" + usuario.getNome() + "' atualizado com sucesso!");
        } else {
            System.out.println("\nOcorreu um erro ao atualizar o usuário. O usuário pode não existir mais.");
        }
    }
}
