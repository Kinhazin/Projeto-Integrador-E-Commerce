import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ModalLogin(props) {
  const metodos = useForm();
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    try {
      setErro("");
      setLoading(true);

      const url = `http://localhost:8080/api/pessoas/buscar?email=${encodeURIComponent(
        data.email
      )}&senha=${encodeURIComponent(data.senha)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erro no servidor. Tente novamente.");
      }

      const pessoa = await response.json();

      if (!pessoa || pessoa.length === 0) {
        throw new Error("E-mail ou senha incorretos.");
      }

      if (pessoa[0].status !== "ativo") {
        throw new Error("Usuário inativo. Entre em contato com o administrador.");
      }

      const grupo = pessoa[0].grupo;

      props.onHide();
      navigate("/homepagelogado", { state: { grupo: grupo, pessoa: pessoa[0] } });
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal show={props.show} onHide={props.onHide} centered size="lg">
      <Modal.Header
        style={{ backgroundColor: "#34495E" }}
        className="text-white border-none"
        closeButton
      >
        <Modal.Title>Entre na sua conta</Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="w-100 text-white d-flex flex-column align-content-center justify-content-center"
        style={{ backgroundColor: "#EDEFF2" }}
      >
        <div className="d-flex align-items-center justify-content-center flex-column gap-4">
          <h2 className="w-100 text-center" style={{ color: "#34495E" }}>
            Login
          </h2>

          <Form
            onSubmit={metodos.handleSubmit(handleSubmit)}
            className="w-100 d-flex align-items-center justify-content-center flex-column gap-4"
          >
            <Form.Group className="col-8">
              <Form.Label className="fs-5 fw-medium" style={{ color: "#34495E" }}>
                E-mail
              </Form.Label>
              <Form.Control
                type="email"
                {...metodos.register("email")}
                required
                placeholder="Digite seu e-mail"
              />
            </Form.Group>

            <Form.Group className="col-8">
              <Form.Label className="fs-5 fw-medium" style={{ color: "#34495E" }}>
                Senha
              </Form.Label>
              <Form.Control
                type="password"
                {...metodos.register("senha")}
                required
                placeholder="Digite sua senha"
              />
            </Form.Group>

            {erro && <p className="text-danger">{erro}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{ background: "#34495E" }}
              className="btn text-white col-3 fw-medium"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </Form>

          <p style={{ color: "#34495E" }}>
            Não possui uma conta?{" "}
            <b
              onClick={() => {
                props.onHide();
                props.abrirCadastro();
              }}
              role="button"
            >
              Clique aqui
            </b>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalLogin;
