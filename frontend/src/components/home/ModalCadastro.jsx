import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { useForm } from "react-hook-form";

function ModalCadastro(props) {
  const metodos = useForm();
  return (
    <Modal show={props.show} onHide={props.onHide} centered size="lg">
      <Modal.Header
        className="text-light"
        style={{ backgroundColor: "#34495E" }}
        closeButton
      >
        <Modal.Title>Cadastra-se</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="w-100 text-white d-flex flex-column align-content-center justify-content-center"
        style={{ backgroundColor: "#EDEFF2" }}
      >
        <Row className="mb-3 d-flex justify-content-center">
          <Form.Group md="4" className="col-5">
            <Form.Label style={{ color: "#34495E" }}>Nome</Form.Label>
            <Form.Control type="text" required minLength={3} />
          </Form.Group>
          <Form.Group md="4" className="col-5">
            <Form.Label style={{ color: "#34495E" }}>Sobrenome</Form.Label>
            <Form.Control required type="text" minLength={3} />
          </Form.Group>
        </Row>
        <Row className="mb-3 d-flex justify-content-center">
          <Form.Group className="col-5">
            <Form.Label style={{ color: "#34495E" }}>CPF</Form.Label>
            <Form.Control
              type="text"
              inputMode="numeric"
              maxLength={11}
              minLength={11}
              {...metodos.register("cpf", {
                required: "Campo obrigatório",
                pattern: {
                  value: /^\d+$/,
                  message: "Apenas números são permitidos",
                },
              })}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                metodos.setValue("cpf", onlyNums);
              }}
            />
          </Form.Group>
          <Form.Group md="4" className="col-5">
            <Form.Label style={{ color: "#34495E" }}>Genêro</Form.Label>
            <Form.Select>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </Form.Select>
          </Form.Group>
        </Row>
        <Row className="mb-5 d-flex justify-content-center">
          <Form.Group className="col-5">
            <Form.Label style={{ color: "#34495E" }}>
              Data de nascimento
            </Form.Label>
            <Form.Control type="date" required></Form.Control>
          </Form.Group>
          <Form.Group md="4" className="col-5">
            <Form.Label style={{ color: "#34495E" }}>Senha</Form.Label>
            <Form.Control required></Form.Control>
          </Form.Group>
        </Row>
        <Row className="mb-3 d-flex justify-content-center">
          <Row
            className="fw-bolder"
            style={{ width: "83.5%", color: "#34495E" }}
          >
            Endereço de faturamento
          </Row>
          <Form.Group className="col-5">
            <Form.Label style={{ color: "#34495E" }}>CEP</Form.Label>

            <Form.Control
              type="text"
              inputMode="numeric"
              maxLength={9}
              minLength={8}
              {...metodos.register("cep", {
                required: "Campo obrigatório",
                pattern: {
                  value: /^\d+$/,
                  message: "Apenas números são permitidos",
                },
              })}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                metodos.setValue("cep", onlyNums);
              }}
            />
          </Form.Group>
          <Form.Group md="4" className="col-5">
            <Form.Label style={{ color: "#34495E" }}>Bairro</Form.Label>
            <Form.Control required></Form.Control>
          </Form.Group>
        </Row>
        <Row className="mb-3 d-flex justify-content-center">
          <Form.Group md="4" className="col-7">
            <Form.Label style={{ color: "#34495E" }}>Lougradouro</Form.Label>
            <Form.Control type="text" required minLength={3} />
          </Form.Group>
          <Form.Group md="4" className="col-3">
            <Form.Label style={{ color: "#34495E" }}>Número</Form.Label>
            <Form.Control required type="number" />
          </Form.Group>
        </Row>
        <Row className="mb-3 d-flex justify-content-center">
          <Form.Group md="4" className="col-5">
            <Form.Label style={{ color: "#34495E" }}>Complemento</Form.Label>
            <Form.Control type="text" required minLength={3} />
          </Form.Group>
          <Form.Group md="4" className="col-3">
            <Form.Label style={{ color: "#34495E" }}>Cidade</Form.Label>
            <Form.Control type="text" required></Form.Control>
          </Form.Group>
          <Form.Group md="4" className="col-2">
            <Form.Label style={{ color: "#34495E" }}>UF</Form.Label>
            <Form.Select required>
              <option value="">Selecione</option>
              <option value="AC">AC</option>
              <option value="AL">AL</option>
              <option value="AP">AP</option>
              <option value="AM">AM</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="MG">MG</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PR">PR</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="RJ">RJ</option>
              <option value="RN">RN</option>
              <option value="RS">RS</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="SC">SC</option>
              <option value="SP">SP</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </Form.Select>
          </Form.Group>
        </Row>
        
      </Modal.Body>
    </Modal>
  );
}

export default ModalCadastro;
