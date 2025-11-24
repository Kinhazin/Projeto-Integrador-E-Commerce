import { useState, useEffect } from "react";
import HeaderDefault from "../components/default/HeaderDefault";
import ModalLogin from "../components/home/ModalLogin";
import ModalCadastro from "../components/home/ModalCadastro";
import { Row, Col, Container, Image, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function Carrinho() {
  const [itensDoCarrinho, setItensDoCarrinho] = useState([]);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { pessoa } = location.state || {};
  const [taxa, setTaxa] = useState(0.15); // frete padrão

  useEffect(() => {
    const todasAsChaves = Object.keys(localStorage);
    const itensCarregados = todasAsChaves
      .map((chave) => {
        try {
          const item = JSON.parse(localStorage.getItem(chave));
          if (item && item.id && item.nome && item.preco && item.quantidadeCarrinho) return item;
          return null;
        } catch (e) {
          return null;
        }
      })
      .filter((item) => item !== null);
    setItensDoCarrinho(itensCarregados);
  }, []);

  const handleAumentarQuantidade = (itemId) => {
    const novosItens = itensDoCarrinho.map((item) => {
      if (item.id === itemId) {
        const atualizado = { ...item, quantidadeCarrinho: item.quantidadeCarrinho + 1 };
        localStorage.setItem(String(item.id), JSON.stringify(atualizado));
        return atualizado;
      }
      return item;
    });
    setItensDoCarrinho(novosItens);
  };

  const handleDiminuirQuantidade = (itemId) => {
    let itemParaRemover = false;
    const novosItens = itensDoCarrinho
      .map((item) => {
        if (item.id === itemId) {
          if (item.quantidadeCarrinho > 1) {
            const atualizado = { ...item, quantidadeCarrinho: item.quantidadeCarrinho - 1 };
            localStorage.setItem(String(item.id), JSON.stringify(atualizado));
            return atualizado;
          } else {
            itemParaRemover = true;
            localStorage.removeItem(String(item.id));
            return null;
          }
        }
        return item;
      })
      .filter((item) => item !== null);
    setItensDoCarrinho(novosItens);
  };

  const handleRemoverDoCarrinho = (itemId) => {
    const novosItens = itensDoCarrinho.filter((item) => item.id !== itemId);
    localStorage.removeItem(String(itemId));
    setItensDoCarrinho(novosItens);
  };

  const precoTotal = itensDoCarrinho.reduce(
    (total, item) => total + parseFloat(item.preco) * item.quantidadeCarrinho,
    0
  );

  const taxaNum = parseFloat(taxa) || 0;
  const totalComFrete = precoTotal + precoTotal * taxaNum;

  function verificarCliente() {
    if (!pessoa) {
      alert("Cadastre-se ou entre na sua conta para finalizar o pedido");
      setShowModalLogin(true);
      return;
    }
    if(itensDoCarrinho.length < 1){
      alert('Você não possui itens no carrinho!')
      throw Error('Sem itens')
    }
    navigate("/checkout", {
      state: { pessoa, carrinho: itensDoCarrinho, taxa: taxaNum, total: totalComFrete },
    });
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#EDEFF2" }}>
      <HeaderDefault openModalLogin={() => setShowModalCadastro(true)} pessoa={pessoa} />
      <Container className="py-5">
        <h1>Meu Carrinho</h1>
        <Row>
          <Col md={8}>
            <div className="d-flex flex-column" style={{ gap: "1rem" }}>
              {itensDoCarrinho.length > 0 ? (
                itensDoCarrinho.map((item) => (
                  <div key={item.id} className="p-3 bg-white shadow-sm rounded">
                    <Row className="align-items-center">
                      <Col xs={9}>
                        <h5>{item.nome}</h5>
                        <p className="mb-0">
                          Preço:{" "}
                          {Number(item.preco * item.quantidadeCarrinho).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </Col>
                      <Col xs={3} className="text-end">
                        {item.imagens && item.imagens.length > 0 && (
                          <Image
                            src={`http://localhost:8080${item.imagens[0].url}`}
                            alt={item.nome}
                            fluid
                            rounded
                            style={{ maxHeight: "75px" }}
                          />
                        )}
                      </Col>
                    </Row>
                    <div className="d-flex gap-2 align-items-center mt-2">
                      <button
                        className="btn text-white"
                        style={{ backgroundColor: "#34495E" }}
                        onClick={() => handleDiminuirQuantidade(item.id)}
                      >
                        -
                      </button>
                      <span className="d-flex align-items-center justify-content-center" style={{ minWidth: "20px" }}>
                        {item.quantidadeCarrinho}
                      </span>
                      <button
                        className="btn text-white"
                        style={{ backgroundColor: "#34495E" }}
                        onClick={() => handleAumentarQuantidade(item.id)}
                      >
                        +
                      </button>
                      <button
                        className="btn text-white"
                        style={{ backgroundColor: "#34495E" }}
                        onClick={() => handleRemoverDoCarrinho(item.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Seu carrinho está vazio.</p>
              )}
            </div>
          </Col>
          <Col md={4}>
            <div className="p-3 bg-white shadow-sm rounded mb-3">
              <Form.Group>
                <Form.Label>Escolha o frete</Form.Label>
                <Form.Select value={taxa} onChange={(e) => setTaxa(parseFloat(e.target.value))}>
                  <option value={0.15}>Entrega padrão</option>
                  <option value={0.20}>Entrega expressa</option>
                  <option value={0.25}>Entrega super rápida</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="p-3 bg-white shadow-sm rounded">
              <h4>Resumo do Pedido</h4>
              <hr />
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <h5>Total:</h5>
                  <h5>
                    {precoTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </h5>
                </div>
                <div className="d-flex justify-content-between">
                  <h5>Total com frete ({taxaNum * 100}%):</h5>
                  <h5>
                    {totalComFrete.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </h5>
                </div>
              </div>
            </div>
            <button
              onClick={verificarCliente}
              style={{ backgroundColor: "rgb(52, 73, 94)" }}
              className="bnt w-100 rounded mt-3 p-1 fs-6 fw-bold text-light"
            >
              Finalizar pedido
            </button>
          </Col>
        </Row>
      </Container>

      {showModalLogin && (
        <ModalLogin show={showModalLogin} onHide={() => setShowModalLogin(false)} abrirCadastro={() => setShowModalCadastro(true)} />
      )}
      {showModalCadastro && <ModalCadastro  usuario={pessoa} show={showModalCadastro} onHide={() => setShowModalCadastro(false)} />}
    </div>
  );
}

export default Carrinho;
