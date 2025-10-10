import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap"; 
import HeaderDefault from "../components/default/HeaderDefault";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [produtos, setProdutos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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
        const itemExistenteString = localStorage.getItem(produto.id);
        let itemParaSalvar;

        if (itemExistenteString) {
            const itemExistente = JSON.parse(itemExistenteString);
            itemExistente.quantidadeCarrinho += 1;
            itemParaSalvar = itemExistente;
            alert(`Mais um ${produto.nome} foi adicionado ao carrinho!`);
        } else {
            itemParaSalvar = { ...produto, quantidadeCarrinho: 1 };
            alert(`${produto.nome} foi adicionado ao carrinho.`);
        }

        localStorage.setItem(String(itemParaSalvar.id), JSON.stringify(itemParaSalvar));
    }

    const produtosFiltrados = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ backgroundColor: "#EDEFF2" }} className="min-vh-100 d-flex flex-column">
            <HeaderDefault />
            <main className="flex-grow-1 p-4">
                <Container fluid>
                    <Row className="mb-4 justify-content-center">
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Buscar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="lg"
                            />
                        </Col>
                    </Row>

                    <Row className="g-4">
                        {produtosFiltrados.map((produto) => {
                            const imagemPrincipal = produto.imagens.find(img => img.principal) || { url: 'https://via.placeholder.com/150' };

                            return (
                                <Col key={produto.id} lg={2} md={4} sm={6} xs={12} className="suave-transition">
                                    <Card className="h-100 shadow-sm">
                                        <Card.Img variant="top" src={"http://localhost:8080" + imagemPrincipal.url} />
                                        <Card.Body>
                                            <Card.Title>{produto.nome || "Nome do Produto"}</Card.Title>
                                            <Card.Text>
                                                {produto.descricao || "Descrição do produto aqui."}
                                            </Card.Text>
                                            <h4>{Number(produto.preco || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h4>
                                            <div className="d-flex gap-2 ">
                                                <button className="btn text-white suave-transition" style={{ background: '#34495E' }}
                                                    onClick={() => navigate(`/detalhes?url=${imagemPrincipal.url}&nome=${produto.nome}&descricao=${produto.descricao}&preco=${produto.preco}&avaliacao=${produto.avaliacao}&id=${produto.id}`)}
                                                >Detalhes</button>
                                                <button className="btn text-white bg-success suave-transition"
                                                    onClick={() => adicionarCarrinho(produto)}>Comprar</button>
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