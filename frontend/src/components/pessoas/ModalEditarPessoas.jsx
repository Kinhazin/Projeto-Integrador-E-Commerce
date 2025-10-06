import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

function ModalEditarCliente(props) {
    const metodo = useForm();
    useEffect(() => {
        if (props.clienteSelecionado) {
            metodo.reset({
                nome: props.clienteSelecionado.nome,
                cpf: props.clienteSelecionado.cpf,
                email: props.clienteSelecionado.email,
                senha: props.clienteSelecionado.senha,
                confirmaSenha: props.clienteSelecionado.senha,
                grupo: props.clienteSelecionado.grupo,
                idEditar: props.clienteSelecionado.id
            });
        }
    }, [props.clienteSelecionado, metodo]);

    // Função para validar CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.charAt(10));
    }

    const onSubmit = async (data) => {
        const { idEditar, nome, cpf, email, senha, confirmaSenha, grupo } = data;
        console.log(data);
        try {
            const emailExiste = props.pessoas.some(
                (pessoa) =>
                    pessoa.email.toLowerCase() === email.toLowerCase() &&
                    pessoa.id !== idEditar
            );

            if (emailExiste) {
                throw new Error("Este e-mail já está cadastrado");
            }

            if (senha && senha !== confirmaSenha) {
                throw new Error("As senhas não coincidem");
            }

            if (!validarCPF(cpf)) {
                throw new Error("CPF inválido");
            }

            const response = await fetch(
                `http://localhost:8080/api/pessoas/${props.clienteSelecionado.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome,
                        cpf,
                        email,
                        senha: senha || props.clienteSelecionado.senha,
                        grupo,
                        status: props.clienteSelecionado.status,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao atualizar cliente");
            }

            alert("Cliente atualizado com sucesso!");
            props.onHide();
            props.getPessoas();
        } catch (error) {
            console.error("Erro ao editar cliente:", error);
            alert(error.message);
        }
    };

    return (
        <Modal show={props.show} onHide={props.onHide} centered size="lg">
            <Modal.Header
                style={{ backgroundColor: "#0B0E10" }}
                className="text-white border-none"
                closeButton
            >
                <Modal.Title>Editar Cliente</Modal.Title>
            </Modal.Header>

            <Modal.Body
                className="w-100 text-white d-flex flex-column align-content-center justify-content-center"
                style={{ backgroundColor: "#191A1C" }}
            >
                <Form
                    id="editaCliente"
                    className="w-100 px-4"
                    onSubmit={metodo.handleSubmit(onSubmit)}
                >
                    <div className="d-flex gap-3 col-12">
                        <Form.Group className="mb-3 col-5" controlId="nome">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome"
                                required
                                {...metodo.register("nome")}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-5" controlId="cpf">
                            <Form.Label>CPF</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o CPF"
                                required
                                {...metodo.register("cpf")}
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3 col-5" controlId="email">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Digite o e-mail"
                            required
                            {...metodo.register("email")}
                        />
                    </Form.Group>

                    <div className="d-flex gap-3 col-12">
                        <Form.Group className="mb-3 col-5" controlId="senha">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Digite a nova senha (opcional)"
                                {...metodo.register("senha")}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-5" controlId="confirmaSenha">
                            <Form.Label>Confirmar Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirme a nova senha"
                                {...metodo.register("confirmaSenha")}
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3 col-5" controlId="grupo">
                        <Form.Label>Grupo do Usuário</Form.Label>
                        <Form.Select {...metodo.register("grupo")}>
                            <option value="estoquista">Estoquista</option>
                            <option value="administrativo">Administrativo</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Control
                        hidden
                        type="number"
                        {...metodo.register("idEditar")}
                    />
                </Form>

                <div className="w-100 d-flex justify-content-center">
                    <button
                        form="editaCliente"
                        type="submit"
                        className="btn text-white col-2"
                        style={{ backgroundColor: "#313132" }}
                    >
                        Salvar
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalEditarCliente;
