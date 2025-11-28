import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import HeaderDefault from "../components/default/HeaderDefault";
import { useNavigate } from "react-router-dom";
import ModalLogin from "../components/home/ModalLogin";
import ModalCadastro from "../components/home/ModalCadastro";
import { useForm } from "react-hook-form";

function HomePage() {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const metodos = useForm();

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

  var pesquisa = metodos.watch("pesquisa") || "";
  var produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const categoriaSelecionada = metodos.watch("categoria") || "";
  useEffect(() => {
    console.log(categoriaSelecionada)
      metodos.setValue("pesquisa", categoriaSelecionada.toLowerCase());
  }, [categoriaSelecionada]);



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
      {showModalLogin && (
        <ModalLogin
          show={showModalLogin}
          onHide={() => setShowModalLogin(false)}
          abrirCadastro={() => setShowModalCadastro(true)}
        />
      )}
      {showModalCadastro && (
        <ModalCadastro
          show={showModalCadastro}
          onHide={() => setShowModalCadastro(false)}
        />
      )}
      <HeaderDefault openModalLogin={() => setShowModalLogin(true)} />
      <main className="flex-grow-1 p-4">
        <Container fluid>
          <Row className="col-3 mb-4">
            <Form.Control {...metodos.register("pesquisa")} placeholder="Pesquise um produto" size="lg" type="search" />
            <Form.Group className="mt-2">
              <Form.Label>Filtrar por categoria:</Form.Label>
              <Form.Select {...metodos.register("categoria")}>
                <option value="">Todas as categorias</option>
                <option value="teclado">Teclados</option>
                <option value="mouse">Mouses</option>
                <option value="headset">Headset</option>
                <option value="cadeira">Cadeira</option>
                <option value="monitor">Monitores</option>
                <option value="gabinete">Gabinetes</option>
                <option value="notebook">Noteboks</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="g-4">
            {produtosFiltrados.map((produto) => {
              const imagemPrincipal =
                produto.imagens.find((img) => img.principal == true) ||
                "https://via.placeholder.com/150";

              return (
                <Col
                  key={produto.id}
                  lg={3}
                  md={3}
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
                      <p className="fs-5">
                        Quantidade: {produto.quantidadeEstoque}
                      </p>
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
