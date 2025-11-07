import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function ModalPagamento({ show, onClose, onConfirm, total, pagamentoSelecionado }) {
  const [formaPagamento, setFormaPagamento] = useState(pagamentoSelecionado?.formaPagamento || "");
  const [dadosCartao, setDadosCartao] = useState(pagamentoSelecionado?.dadosCartao || {
    numero: "",
    nome: "",
    validade: "",
    codigo: "",
    parcelas: "1",
  });

  useEffect(() => {
    if (pagamentoSelecionado) {
      setFormaPagamento(pagamentoSelecionado.formaPagamento);
      setDadosCartao(pagamentoSelecionado.dadosCartao || dadosCartao);
    }
  }, [pagamentoSelecionado]);

  const handleConfirmar = () => {
    if (!formaPagamento) {
      alert("Selecione uma forma de pagamento.");
      return;
    }

    if (formaPagamento === "Cartão de Crédito" || formaPagamento === "Cartão de Débito") {
      const { numero, nome, validade, codigo } = dadosCartao;
      if (!numero || !nome || !validade || !codigo) {
        alert("Preencha todos os campos do cartão.");
        return;
      }
    }

    const dadosPagamento = {
      formaPagamento,
      dadosCartao: formaPagamento === "Cartão de Crédito" || formaPagamento === "Cartão de Débito" ? dadosCartao : null,
    };

    onConfirm(dadosPagamento);
  };

  const handleChangeCartao = (e) => {
    const { name, value } = e.target;
    setDadosCartao({ ...dadosCartao, [name]: value });
  };

  const paymentColors = {
    Pix: "success",
    Boleto: "warning",
    "Cartão de Crédito": "primary",
    "Cartão de Débito": "info",
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#34495E" }}>
        <Modal.Title className="text-white">Forma de Pagamento</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Selecione o método:</Form.Label>
            <div className="d-flex flex-column gap-2">
              {["Pix", "Boleto", "Cartão de Crédito", "Cartão de Débito"].map((metodo) => (
                <Button
                  key={metodo}
                  variant={formaPagamento === metodo ? paymentColors[metodo] : "outline-secondary"}
                  className="text-start"
                  onClick={() => setFormaPagamento(metodo)}
                >
                  {metodo}
                </Button>
              ))}
            </div>
          </Form.Group>

          {(formaPagamento === "Cartão de Crédito" || formaPagamento === "Cartão de Débito") && (
            <div className="mt-4 p-3 rounded border">
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Label>Número do cartão</Form.Label>
                  <Form.Control
                    type="text"
                    name="numero"
                    placeholder="Digite o número do cartão"
                    value={dadosCartao.numero}
                    onChange={handleChangeCartao}
                    maxLength={16}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Label>Nome completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    placeholder="Como está no cartão"
                    value={dadosCartao.nome}
                    onChange={handleChangeCartao}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Validade</Form.Label>
                  <Form.Control
                    type="month"
                    name="validade"
                    value={dadosCartao.validade}
                    onChange={handleChangeCartao}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Código de segurança</Form.Label>
                  <Form.Control
                    type="password"
                    name="codigo"
                    placeholder="CVV"
                    maxLength={3}
                    value={dadosCartao.codigo}
                    onChange={handleChangeCartao}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Label>Parcelas</Form.Label>
                  <Form.Select
                    name="parcelas"
                    value={dadosCartao.parcelas}
                    onChange={handleChangeCartao}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}x de R${" "}
                        {(total / num).toFixed(2).replace(".", ",")}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button style={{ backgroundColor: "#34495E" }} onClick={handleConfirmar}>Confirmar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalPagamento;
