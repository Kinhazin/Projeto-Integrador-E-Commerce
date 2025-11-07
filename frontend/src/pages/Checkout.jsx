import { useState, useEffect } from "react";
import HeaderDefault from "../components/default/HeaderDefault";
import ModalAdicionarEndereco from "../components/home/ModalAdicionarEndereco";
import ModalPagamento from "../components/home/ModalPagamento";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pessoa, carrinho, taxa, total: totalInicial } = location.state || {};
  const [enderecos, setEnderecos] = useState([]);
  const [valorProdutos, setValorProdutos] = useState(0);
  const [frete, setFrete] = useState(0);
  const [total, setTotal] = useState(0);

  const [showModalAddEndereco, setShowModalAddEndereco] = useState(false);
  const [showModalPagamento, setShowModalPagamento] = useState(false);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);

  // Busca endereços
  const getEnderecos = async (pessoaId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/enderecos/por-pessoa/${pessoaId}`);
      if (response.ok) {
        const data = await response.json();
        setEnderecos(data.filter((e) => e.tipo.includes("entrega")));
      }
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    }
  };

  useEffect(() => {
    if (pessoa?.id) getEnderecos(pessoa.id);

    if (carrinho && carrinho.length > 0) {
      const valorProdutosNum = carrinho.reduce(
        (acc, item) => acc + parseFloat(item.preco) * (parseInt(item.quantidadeCarrinho) || 1),
        0
      );

      const taxaNum = parseFloat(taxa || 0);
      const freteNum = valorProdutosNum * taxaNum;
      const totalNum = valorProdutosNum + freteNum;

      setValorProdutos(valorProdutosNum);
      setFrete(freteNum);
      setTotal(totalNum);
    }
  }, [carrinho, taxa, pessoa]);

  const handlePagamentoConfirmado = (dadosPagamento) => {
    setPagamentoSelecionado(dadosPagamento);
    setShowModalPagamento(false);

    navigate("/resumo-pedido", {
      state: {
        pessoa,
        carrinho,
        total,
        frete,
        taxa,
        pagamento: dadosPagamento,
        enderecos,
      },
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#EDEFF2" }}>
      {showModalAddEndereco && (
        <ModalAdicionarEndereco
          fecharPai={() => {}}
          getEndereco={getEnderecos}
          id={pessoa?.id}
          show={showModalAddEndereco}
          onHide={() => setShowModalAddEndereco(false)}
        />
      )}

      {showModalPagamento && (
        <ModalPagamento
          show={showModalPagamento}
          onClose={() => setShowModalPagamento(false)}
          onConfirm={handlePagamentoConfirmado}
          total={total}
          pagamentoSelecionado={pagamentoSelecionado}
        />
      )}

      <HeaderDefault pessoa={pessoa} />

      <Container className="py-5">
        <Row>
          <Col md={8}>
            <div className="bg-light rounded-1 shadow-sm p-3 mb-3">
              <p className="fw-semibold mb-1">Selecione seu endereço:</p>
              <Form>
                {enderecos.length > 0 ? (
                  enderecos.map((endereco) => (
                    <Form.Check
                      key={endereco.id}
                      name="endereco"
                      type="radio"
                      label={`${endereco.logradouro}, ${endereco.numero} - ${endereco.cidade}`}
                      className="mb-2"
                    />
                  ))
                ) : (
                  <p>Não há endereços cadastrados</p>
                )}
              </Form>
              <button
                className="btn text-light mt-2"
                style={{ backgroundColor: "#34495E" }}
                onClick={() => setShowModalAddEndereco(true)}
              >
                Cadastrar endereço
              </button>
            </div>
          </Col>

          <Col md={4}>
            <div className="bg-light rounded-1 shadow-sm p-2 mb-3">
              <p className="fs-6 m-0 fw-semibold mb-3">RESUMO</p>
              <div className="d-flex justify-content-between mb-1">
                <span>Produtos:</span>
                <b>R$ {valorProdutos.toFixed(2).replace(".", ",")}</b>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Frete:</span>
                <b>R$ {frete.toFixed(2).replace(".", ",")}</b>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total:</span>
                <b>R$ {total.toFixed(2).replace(".", ",")}</b>
              </div>
            </div>

            <button
              className="btn w-100 text-light"
              style={{ backgroundColor: "#34495E" }}
              onClick={() => setShowModalPagamento(true)}
            >
              Continuar
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Checkout;
