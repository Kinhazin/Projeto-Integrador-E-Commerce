import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import CadastroEndereco from "./CadastroEndereco";
import CadastroPessoa from "./CadastroPessoa";
function ModalCadastro(props) {
  const metodos = useForm();

  const utilizar = useWatch({
    control: metodos.control,
    name: "utilizarIgual",
  });

  const handleSubmit = async (data) => {
    const pessoa = {
      nome: data.nome + " " + data.sobrenome,
      cpf: data.cpf,
      data_nascimento: new Date(data.nascimento).toISOString().split("T")[0],
      genero: data.genero,
      email: data.email,
      senha: data.senha,
      status: "ativo",
      grupo: "cliente",
    };

    try {
      const response = await fetch("http://localhost:8080/api/pessoas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(pessoa),
      });
      if (response.ok) {
        alert("Usuário adicionado com sucesso");

        const url = `http://localhost:8080/api/pessoas/buscar?email=${encodeURIComponent(
          data.email
        )}&senha=${encodeURIComponent(data.senha)}`;

        const resposta = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dado = await resposta.json();

        const id_pessoas = dado[0].id;

        console.log(data);
        console.log(id_pessoas);

        const faturamento = {
          cep: data.cepfaturamento,
          bairro: data.bairrofaturamento,
          logradouro: data.logradourofaturamento,
          numero: data.numerofaturamento,
          complemento: data.complementofaturamento,
          cidade: data.cidadefaturamento,
          estado: data.estadofaturamento,
          tipo: "faturamento",
          pessoa: {
            id: id_pessoas,
          },
        };
        const resps = await fetch("http://localhost:8080/api/enderecos", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(faturamento),
        });

        if (!resps.ok) {
          const errorMessage = await resps.text();
          throw new Error(errorMessage);
        }

        alert("Adicionado com sucesso");
      }
    } catch (erro) {
      console.log(erro.message);
    }
    console.log(pessoa);
  };

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
        <FormProvider {...metodos}>
          <Form onSubmit={metodos.handleSubmit(handleSubmit)}>
            <CadastroPessoa />
            <CadastroEndereco tipo={"faturamento"} />
            <Row className="mb-3 d-flex justify-content-center">
              <Row
                className="fw-bolder mb-3"
                style={{ width: "86%", color: "#34495E" }}
              >
                <Form.Check
                  defaultChecked
                  type="switch"
                  id="custom-switch"
                  label="Utilizar o mesmo endereço de faturamento para a entrega"
                  {...metodos.register("utilizarIgual")}
                />
              </Row>
              {utilizar == false && <CadastroEndereco tipo={"entrega"} />}
            </Row>
            <Button type="submit" className="bnt">
              Enviar
            </Button>
          </Form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
}

export default ModalCadastro;
