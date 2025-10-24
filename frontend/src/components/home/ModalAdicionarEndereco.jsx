import CadastroEndereco from "./CadastroEndereco";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
function ModalAdicionarEndereco(props) {
  const metodos = useForm();

  const handleSubmit = async (data) => {
    const entrega = {
      cep: data.cepentrega1,
      bairro: data.bairroentrega1,
      logradouro: data.logradouroentrega1,
      numero: data.numeroentrega1,
      complemento: data.complementoentrega1,
      cidade: data.cidadeentrega1,
      estado: data.estadoentrega1,
      tipo: "entrega",
      pessoa: {
        id: props.id,
      },
    };

    const resps2 = await fetch("http://localhost:8080/api/enderecos", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(entrega),
    });
    if (!resps2.ok) {
      const errorMessage = await resps2.text();
      throw new Error(errorMessage);
    }
    props.getEndereco();
    alert("Adicionado com sucesso");
    props.fecharPai()
  };

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
        <FormProvider {...metodos}>
          <Form onSubmit={metodos.handleSubmit(handleSubmit)}>
            <CadastroEndereco index={1} tipo={"entrega"} />
            <button type="submit"> Enviar </button>
          </Form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
}
export default ModalAdicionarEndereco;
