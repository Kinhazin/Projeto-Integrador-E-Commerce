package Aplicacao;

import Service.UsuarioService;

public class Main {

    public static void main(String[] args) {
        String grupoDoUsuario = null;

        while (true) {

            if (Programa.logarOuCadastrar()) {

                String resultadoLogin = Programa.logar();

                if (!"falso".equals(resultadoLogin)) {
                    grupoDoUsuario = resultadoLogin;
                    System.out.println("\nLogin realizado com sucesso!");
                    break;
                } else {
                    System.out.println("\nUsuário ou senha inválidos.");
                }
            } else {
                UsuarioService.cadastrarNovoUsuario(Programa.getScanner());
            }
        }

        System.out.println("\n--- BEM-VINDO AO SISTEMA, " + grupoDoUsuario + " ---");

        switch (grupoDoUsuario) {
            case "USUARIO":
                if (Programa.escolha("\nDeseja listar os produtos?\n[1] Sim | [2] Não\nEscolha: ")) {
                    Programa.listaProdutos();
                }
                break;
            case "ADMINISTRADOR":
                boolean sairMenuAdmin = false;
                do {
                    int escolhaAdmin = Programa.lerEscolhaMenu(
                            "\n--- MENU DO ADMINISTRADOR ---\n"
                            + "[1] Listar todos os produtos\n"
                            + "[2] Listar todos os clientes (usuários)\n"
                            + "[3] Cadastrar novo usuário\n"
                            + "[4] Editar usuário\n"
                            + "[5] Sair\n" 
                            + "Escolha uma opção: ",
                            5
                    );

                    switch (escolhaAdmin) {
                        case 1:
                            System.out.println("\n--- Exibindo todos os produtos ---");
                            Programa.listaProdutos();
                            break;
                        case 2:
                            System.out.println("\n--- Exibindo todos os clientes ---");
                            Programa.listaUsuarios();
                            break;
                        case 3:
                            UsuarioService.cadastrarUsuarioPeloAdmin(Programa.getScanner());
                            break;
                        case 4:
                            UsuarioService.editarUsuarioPeloAdmin(Programa.getScanner());
                            break;
                        case 5:
                            sairMenuAdmin = true;
                            break;
                        default:
                            System.out.println("\n❌ Opção inválida. Tente novamente.");
                            break;
                    }
                } while (!sairMenuAdmin);
                break;
        }

        System.out.println("\nFim do programa.");
    }
}
