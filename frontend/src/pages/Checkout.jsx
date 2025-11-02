import HeaderDefault from "../components/default/HeaderDefault";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalCadastro from "../components/home/ModalCadastro";
import ModalAdicionarEndereco from "../components/home/ModalAdicionarEndereco";
import { Form } from "react-bootstrap";
function Checkout() {
  const location = useLocation();
  const { pessoa, carrinho, taxa } = location.state || {};
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [enderecos, setEnderecos] = useState([]);
  const [valorProdutos, setValorProdutos] = useState(0);
  const [frete, setFrete] = useState(0);
  const [total, setTotal] = useState(0);
  const [showModalAddMaisEndereco, setShowModalAddMaisEndereco ] = useState(false);

  const getEnderecos = async (pessoaId) => {
    const response = await fetch(
      `http://localhost:8080/api/enderecos/por-pessoa/${pessoaId}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setEnderecos(
        data.filter(
          (endereco) =>
            endereco.tipo == "entrega" ||
            endereco.tipo == "entrega  e faturamento"
        )
      );
    }
  };

  useEffect(() => {
    getEnderecos(pessoa.id);
    if (carrinho.length > 0) {
      console.log(carrinho);
      let valor;
      carrinho.map((item) => {
        valor = +parseFloat(item.preco);
      });
      setValorProdutos(valor);
      let total = parseFloat(valor * taxa).toFixed(2);
      setFrete(total);
      setTotal(parseFloat(valor) + parseFloat(total));
    }
  }, [showModalAddMaisEndereco]);

  return (
    <>
      <div style={{ minHeight: "100vh", backgroundColor: "#EDEFF2" }}>
        {showModalEdit && (
          <ModalCadastro
            show={showModalEdit}
            onHide={() => setShowModalEdit(false)}
            usuario={pessoa}
          />
        )}
        {showModalAddMaisEndereco && (
          <ModalAdicionarEndereco
            fecharPai={()=> console.log('oi')}
            getEndereco={getEnderecos}
            id={pessoa?.id}
            show={showModalAddMaisEndereco}
            onHide={() => setShowModalAddMaisEndereco(false)}
          />
        )}
        <HeaderDefault
          openModalLogin={() => setShowModalEdit(true)}
          pessoa={pessoa}
        />
        <Container className="py-5 ">
          <Row>
            <Col md={8}>
              <div className="bg-light rounded-1 shadow-sm">
                <p className=" px-4 py-2 mb-1 fw-semibold">
                  Selecione seu endereço:
                </p>
                <Form className="d-flex justify-content-center align-items-center flex-column">
                  {enderecos.length > 0 ? (
                    enderecos.map((endereco) => (
                      <Form.Check
                        key={endereco.id}
                        style={{ width: "95%", border: "1.5px solid #34495E" }}
                        className="fs-6 my-2 fw-lighter text-black ps-5 py-3 rounded"
                        name="endereco"
                        type="radio"
                        label={`${endereco.logradouro}, ${endereco.numero} - ${endereco.cidade}, ${endereco.estado} - CEP ${endereco.cep} `}
                      />
                    ))
                  ) : (
                    <>
                      <p className="fw-lighter">Não há endereços cadastrados</p>
                    </>
                  )}
                </Form>
                <button
                  className="ms-3 mb-2 btn text-light"
                  onClick={()=>setShowModalAddMaisEndereco(true)}
                  style={{
                    backgroundColor: "rgb(52, 73, 94)",
                    fontSize: "13px",
                  }}
                >
                  Cadastrar endereço
                </button>
              </div>
            </Col>
            <Col md={3}>
              <div className="bg-light rounded-1 shadow-sm p-2">
                <p className="fs-6 m-0 fw-semibold mb-3">RESUMO</p>
                <p className="text-placeholder m-0 p-0 fw-lighter d-flex justify-content-between mb-2 border-bottom pb-1">
                  Valor dos produtos:{" "}
                  <b className="fw-bold">R$ {`${valorProdutos}`}</b>
                </p>
                <p className="text-placeholder m-0 p-0 fw-lighter d-flex justify-content-between mb-2 border-bottom pb-1">
                  Frete: <b className="fw-bold">R$ {`${frete}`}</b>
                </p>
                <p className="text-placeholder m-0 p-0 fw-lighter d-flex justify-content-between mb-2">
                  Total: <b className="fw-bold">R$ {`${total}`}</b>
                </p>
              </div>
              <button
                style={{ backgroundColor: "rgb(52, 73, 94)" }}
                className="bnt w-100 rounded mt-3 p-1 fs-6 fw-bold text-light"
              >
                {" "}
                Continuar
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Checkout;
