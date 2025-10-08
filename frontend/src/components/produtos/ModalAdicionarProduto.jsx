import { useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

function ModalAdicionarProduto(props) {
  const metodo = useForm();
  useEffect(() => {
    metodo.reset();
  }, [props.show, metodo]);

  const onSubmit = async (data) => {
    const { nome, descricao, preco, estoque, avaliacao, status, imagens } =
      data;

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco", String(preco).replace(",", "."));
    formData.append("avaliacao", String(avaliacao).replace(",", "."));
    formData.append("quantidadeEstoque", estoque);
    formData.append("status", status);

    for (let i = 0; i < imagens.length; i++) {
      formData.append("imagens", imagens[i]);
    }

    try {
      const response = await fetch("http://localhost:8080/api/produtos", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        props.onHide();
        props.getProdutos();
      } else {
        throw new Error("Erro ao cadastrar produto");
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto, verifique os campos");
    }
  };

  return (
    <Modal show={props.show} onHide={props.onHide} centered size="lg">
      <Modal.Header
        style={{ backgroundColor: "#34495E" }}
        className="text-white border-none"
        closeButton
      >
        <Modal.Title>Cadastrar Novo Produto</Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="w-100 text-white d-flex flex-column align-content-center justify-content-center"
        style={{ backgroundColor: "#EDEFF2" }}
      >
        <Form
          id="form-cadastro-produto"
          className="w-100 px-4"
          onSubmit={metodo.handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          <Form.Group className="mb-3" controlId="nome">
            <Form.Label style={{ color: "#34495E" }}>
              Nome do Produto
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome do produto"
              maxLength="200"
              required
              {...metodo.register("nome")}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="avaliacao">
            <Form.Label style={{ color: "#34495E" }}>Avaliação</Form.Label>
            <Form.Control
              type="number"
              min="0.5"
              max="5"
              step="0.5"
              required
              {...metodo.register("avaliacao")}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="descricao">
            <Form.Label style={{ color: "#34495E" }}>
              Descrição Detalhada
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              maxLength="2000"
              placeholder="Descreva o produto"
              required
              {...metodo.register("descricao")}
            />
          </Form.Group>

          <div className="d-flex gap-3 col-12">
            <Form.Group className="mb-3 col-6" controlId="preco">
              <Form.Label style={{ color: "#34495E" }}>Preço (R$)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                required
                {...metodo.register("preco")}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-6" controlId="estoque">
              <Form.Label style={{ color: "#34495E" }}>
                Quantidade em Estoque
              </Form.Label>
              <Form.Control
                type="number"
                min="0"
                required
                {...metodo.register("estoque")}
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3" controlId="imagens">
            <Form.Label style={{ color: "#34495E" }}>
              Imagens do Produto
            </Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              {...metodo.register("imagens")}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imagens">
            <Form.Label style={{ color: "#34495E" }}>Status</Form.Label>
            <Form.Select defaultValue="ativo" {...metodo.register("status")}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </Form.Select>
          </Form.Group>
        </Form>

        <div className="w-100 d-flex justify-content-center">
          <button
            form="form-cadastro-produto"
            type="submit"
            className="btn text-white col-2"
            style={{ backgroundColor: "#34495E" }}
          >
            Cadastrar
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalAdicionarProduto;
