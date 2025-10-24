import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import HeaderDefault from "../components/default/HeaderDefault";
import { useLocation, useNavigate } from "react-router-dom";

function HomePageLogado() {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { grupo, pessoa } = location.state || {};

  // 🚫 Bloqueia acesso direto
  if (!location.state || !location.state.pessoa) {
    return (
      <div
        style={{
          backgroundColor: "#EDEFF2",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#34495E",
        }}
      >
        <h3>Você precisa estar logado para acessar esta página.</h3>
      </div>
    );
  }

  // 🔄 Buscar produtos
  async function getProdutos() {
    try {
      const response = await fetch("http://localhost:8080/api/produtos");
      if (!response.ok) {
        throw new Error(`Falha ao carregar produtos (${response.status})`);
      }
      const data = await response.json();
      setProdutos(data ?? []);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setProdutos([]);
    }
  }

  useEffect(() => {
    getProdutos();
  }, []);

  // 🛒 Adicionar ao carrinho
  function adicionarCarrinho(produto) {
    produto.quantidadeCarrinho = produto.quantidadeCarrinho ?? 1;
    const produtoExiste = localStorage.getItem(produto.id);
    if (produtoExiste != null) {
      produto.quantidadeCarrinho += 1;
      alert(`Mais um ${produto.nome} adicionado no carrinho`);
    } else {
      alert(`${produto.nome} adicionado ao carrinho`);
    }
    localStorage.setItem(produto.id, JSON.stringify(produto));
  }

  // 🔚 Logout
  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div
      style={{ backgroundColor: "#EDEFF2" }}
      className="min-vh-100 d-flex flex-column"
    >
      <HeaderDefault openModalLogin={null} />

      <div
        className="d-flex justify-content-between align-items-center p-4"
        style={{ color: "#34495E" }}
      >
        <h4>Bem-vindo, {pessoa?.nome || "Usuário"}!</h4>
        <button
          className="btn text-white"
          style={{ backgroundColor: "#34495E" }}
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>

      <main className="flex-grow-1 p-4">
        <Container fluid>
          <Row className="g-4">
            {produtos.map((produto) => {
              const imagemPrincipal =
                produto.imagens.find((img) => img.principal === true) ||
                "https://via.placeholder.com/150";

              return (
                <Col
                  key={produto.id}
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="suave-transition"
                >
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={
                        "http://localhost:8080" + imagemPrincipal.url ??
                        "https://via.placeholder.com/150"
                      }
                    />
                    <Card.Body>
                      <Card.Title>{produto.nome}</Card.Title>
                      <Card.Text>{produto.descricao}</Card.Text>
                      <h4>R$ {produto.preco}</h4>
                      <div className="d-flex gap-2">
                        <button
                          className="btn text-white suave-transition"
                          style={{ background: "#34495E" }}
                          onClick={() =>
                            navigate(
                              `/detalhes?url=${imagemPrincipal.url}&nome=${produto.nome}&descricao=${produto.descricao}&preco=${produto.preco}&avaliacao=${produto.avaliacao}&id=${produto.id}`
                            )
                          }
                        >
                          Detalhes
                        </button>
                        <button
                          className="btn text-white bg-success suave-transition"
                          onClick={() => adicionarCarrinho(produto)}
                        >
                          Comprar
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </main>
    </div>
  );
}

export default HomePageLogado;
