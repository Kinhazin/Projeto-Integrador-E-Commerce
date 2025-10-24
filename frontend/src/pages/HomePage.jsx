import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap"; 
import HeaderDefault from "../components/default/HeaderDefault";
import { useNavigate } from "react-router-dom";
import ModalLogin from "../components/home/modalLogin";
import ModalCadastro from "../components/home/ModalCadastro";

function HomePage() {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalCadastro, setShowModalCadastro] = useState(false);

  // Sua função para buscar dados está ótima, não precisa mudar!
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

  function adicionarCarrinho(produto) {
    produto.quantidadeCarrinho = produto.quantidadeCarrinho ?? 1;
    const produtoExiste = localStorage.getItem(produto.id);
    if (produtoExiste != null) {
      produto.quantidadeCarrinho += 1;
      alert(`Mais um ${produto.nome} adicionado no carrinho`);
    } else {
      alert(`${produto.nome} adicionado ao carrinho`);
    }
    const produtoString = JSON.stringify(produto);
    localStorage.setItem(produto.id, produtoString);
    console.log(localStorage.getItem(produto.id));
  }

  return (
    <div
      style={{ backgroundColor: "#EDEFF2" }}
      className="min-vh-100 d-flex flex-column"
    >
        {showModalLogin && 
        <ModalLogin
        show={showModalLogin}
        onHide={()=>setShowModalLogin(false)}
        abrirCadastro={()=>setShowModalCadastro(true)}
        />}
        {showModalCadastro &&
        <ModalCadastro
        show={showModalCadastro}
        onHide={()=>setShowModalCadastro(false)}
        />}
      <HeaderDefault 
      openModalLogin={()=>setShowModalLogin(true)}/>
      <main className="flex-grow-1 p-4">
        <Container fluid>
          <Row className="g-4">
            {produtos.map((produto) => {
              const imagemPrincipal =
                produto.imagens.find((img) => img.principal == true) ||
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
                      <Card.Title>
                        {produto.nome || "Nome do Produto"}
                      </Card.Title>
                      <Card.Text>
                        {produto.descricao || "Descrição do produto aqui."}
                      </Card.Text>
                      <h4>R$ {produto.preco || "0,00"}</h4>
                      <div className="d-flex gap-2 ">
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

export default HomePage;
