import { Row } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
function CadastroPessoa({onlyRead}) {
  const metodos = useFormContext();
  return (
    <>
      <Row className="mb-3 d-flex justify-content-center">
        <Form.Group md="4" className="col-5">
          <Form.Label style={{ color: "#34495E" }}>Nome</Form.Label>
          <Form.Control
            type="text"
            required
            
            minLength={3}
            {...metodos.register("nome")}
          />
        </Form.Group>
        <Form.Group md="4" className="col-5">
          <Form.Label style={{ color: "#34495E" }}>Sobrenome</Form.Label>
          <Form.Control
            required
            type="text"
            minLength={3}
            {...metodos.register("sobrenome")}
          />
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
            {...onlyRead}
            required
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
          <Form.Select {...metodos.register("genero")}>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </Form.Select>
        </Form.Group>
      </Row>
      <Row className="mb-3 d-flex justify-content-center">
        <Form.Group className="col-5">
          <Form.Label style={{ color: "#34495E" }}>
            Data de nascimento
          </Form.Label>
          <Form.Control
            {...metodos.register("nascimento")}
            type="date"
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group md="4" className="col-5">
          <Form.Label style={{ color: "#34495E" }}>Senha</Form.Label>
          <Form.Control {...metodos.register("senha")} required></Form.Control>
        </Form.Group>
      </Row>
      <Row className="mb-5 d-flex justify-content-center">
        <Form.Group md="4" className="col-10">
          <Form.Label style={{ color: "#34495E" }}>E-mail</Form.Label>
          <Form.Control {...metodos.register("email")} {...onlyRead}required></Form.Control>
        </Form.Group>
        <Form.Group md="4" className="col-5"></Form.Group>
      </Row>
    </>
  );
}
export default CadastroPessoa;
