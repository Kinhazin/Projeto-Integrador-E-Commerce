import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

function ModalAdicionarPessoas(props) {
  const metodo = useForm();
  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  }

  const onSubmit = async (data) => {
    const { nome, cpf, email, senha, confirmaSenha, grupo } = data;
    try {
      // Validação de e-mail duplicado
      const emailExistente = props.pessoas.some(
        (element) => element.email === email
      );
      if (emailExistente) {
        throw new Error("E-mail já cadastrado");
      }

      // Validação de senhas diferentes
      if (senha !== confirmaSenha) {
        throw new Error("As senhas não coincidem");
      }

      // Validação de CPF
      if (!validarCPF(cpf)) {
        throw new Error("CPF inválido");
      }

      const response = await fetch("http://localhost:8080/api/pessoas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          cpf,
          email,
          senha,
          grupo,
          status: "ativo",
        }),
      });
      if (response.ok) {
        alert("Pessoa adicionada com sucesso!");
        metodo.reset();
        props.onHide();
        props.getPessoas();
      }
    } catch (error) {
      console.error("Erro ao adicionar pessoa:", error);
      alert(error.message);
    }
  };


  return (
    <Modal show={props.show} onHide={() => {
      metodo.reset();
      props.onHide();
      }} centered size="lg">
      <Modal.Header
        style={{ backgroundColor: "#34495E" }}
        className="text-white border-none"
        closeButton
      >
        <Modal.Title>Adicionar Pessoas</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="w-100 text-white d-flex flex-column align-content-center justify-content-center"
        style={{ backgroundColor: "#EDEFF2" }}
      >
        <Form
          id="addCliente"
          className="w-100 px-4"
          onSubmit={metodo.handleSubmit(onSubmit)}
        >
          <div className="d-flex gap-3 col-12">
            <Form.Group className="mb-3 col-5" controlId="nome">
              <Form.Label style={{color: '#34495E'}}>Nome</Form.Label>
              <Form.Control
                type="text"
                className="col-6"
                placeholder="Digite o nome"
                required
                {...metodo.register("nome")}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-5" controlId="cpf">
              <Form.Label style={{color: '#34495E'}}>CPF</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Digite o CPF"
                {...metodo.register("cpf")}
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3 col-5" controlId="email">
            <Form.Label style={{color: '#34495E'}}>E-mail</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="Digite o e-mail"
              {...metodo.register("email")}
            />
          </Form.Group>
          <div className="d-flex gap-3 col-12">
            <Form.Group className="mb-3 col-5" controlId="senha">
              <Form.Label style={{color: '#34495E'}}>Senha</Form.Label>
              <Form.Control
                type="password"
                required
                placeholder="Digite a senha"
                {...metodo.register("senha")}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-5" controlId="confirmaSenha">
              <Form.Label style={{color: '#34495E'}}>Confirmar Senha</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Confirme a senha"
                {...metodo.register("confirmaSenha")}
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3 col-5" controlId="grupo">
            <Form.Label style={{color: '#34495E'}}>Grupo do Usuário</Form.Label>
            <Form.Select {...metodo.register("grupo")}>
              <option value="estoquista">Estoquista</option>
              <option value="administrativo">Administrativo</option>
            </Form.Select>
          </Form.Group>
        </Form>
        <div className="w-100 d-flex justify-content-center">
          <button
            form="addCliente"
            type="submit"
            variant="primary"
            className="btn text-white col-2"
            style={{ backgroundColor: "#34495E" }}
          >
            Enviar
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
export default ModalAdicionarPessoas;
