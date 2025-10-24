import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

function CadastroEndereco({ tipo }) {
  const metodos = useFormContext();
  const cep = metodos.watch(`cep${tipo}`);

  useEffect(() => {
    async function fetchAddress() {
      if (cep && cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          if (!response.ok) {
            throw new Error(`Erro ao buscar o endereço (${response.status})`);
          }
          const data = await response.json();
          if (data.erro) {
            alert("CEP não encontrado");
            return;
          }
          metodos.setValue(`bairro${tipo}`, data.bairro);
          metodos.setValue(`logradouro${tipo}`, data.logradouro);
          metodos.setValue(`cidade${tipo}`, data.localidade);
          metodos.setValue(`estado${tipo}`, data.uf);
        } catch (err) {
          console.error("Erro ao buscar o endereço:", err);
        }
      }
    }
    fetchAddress();
  })

    return (<>
      <Row className="mb-3 d-flex justify-content-center">
        <Row
          className="fw-bolder"
          style={{ width: "83.5%", color: "#34495E" }}
        >
          Endereço de {tipo}
        </Row>
        <Form.Group className="col-5">
          <Form.Label style={{ color: "#34495E" }}>CEP</Form.Label>

          <Form.Control
            type="text"
            inputMode="numeric"
            maxLength={8}
            minLength={8}
            {...metodos.register(`cep${tipo}`, {
              required: "Campo obrigatório",
              pattern: {
                value: /^\d+$/,
                message: "Apenas números são permitidos",
              },
            })}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              metodos.setValue(`cep${tipo}`, onlyNums);
            }}
          />
        </Form.Group>
        <Form.Group md="4" className="col-5">
          <Form.Label style={{ color: "#34495E" }}>Bairro</Form.Label>
          <Form.Control
            {...metodos.register(`bairro${tipo}`)}
            required
          ></Form.Control>
        </Form.Group>
      </Row>
      <Row className="mb-3 d-flex justify-content-center">
        <Form.Group md="4" className="col-7">
          <Form.Label style={{ color: "#34495E" }}>Logradouro</Form.Label>
          <Form.Control
            {...metodos.register(`logradouro${tipo}`)}
            type="text"
            required
            minLength={3}
          />
        </Form.Group>
        <Form.Group md="4" className="col-3">
          <Form.Label
            style={{ color: "#34495E" }}
          >
            Número
          </Form.Label>
          <Form.Control required type="number"
            {...metodos.register(`numero${tipo}`)}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3 d-flex justify-content-center">
        <Form.Group md="4" className="col-5">
          <Form.Label style={{ color: "#34495E" }}>Complemento</Form.Label>
          <Form.Control
            type="text"
            required
            {...metodos.register(`complemento${tipo}`)}
          />
        </Form.Group>
        <Form.Group md="4" className="col-3">
          <Form.Label style={{ color: "#34495E" }}>Cidade</Form.Label>
          <Form.Control
            type="text"
            {...metodos.register(`cidade${tipo}`)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group md="4" className="col-2">
          <Form.Label style={{ color: "#34495E" }}>UF</Form.Label>
          <Form.Select {...metodos.register(`estado${tipo}`)} required>
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
    </>)
  }
export default CadastroEndereco;