import HeaderDefault from "../components/default/HeaderDefault";
import { Row, Col, Container, Image } from "react-bootstrap";

function Carrinho() {
    const todasAsChaves = Object.keys(localStorage);

    const itensDoCarrinho = todasAsChaves.map(chave => {
        try {
            const item = JSON.parse(localStorage.getItem(chave));
            if (item && item.id && item.nome && item.preco) {
                return item;
            }
            return null;
        } catch (e) {
            return null;
        }
    }).filter(item => item !== null);
    const precoTotal = itensDoCarrinho.reduce((total, item) => {

        return total + parseFloat(item.preco * item.quantidadeCarrinho || 0);
    }, 0);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#EDEFF2' }}>
            <HeaderDefault />
            <Container className="py-5">
                <h1>Meu Carrinho</h1>
                <Row>
                    <Col md={8}>
                        <div className="d-flex flex-column" style={{ gap: '1rem' }}>
                            {itensDoCarrinho.length > 0 ? (
                                itensDoCarrinho.map(item => (
                                    <div key={item.id} className="p-3 bg-white shadow-sm rounded">

                                        <Row className="align-items-center">
                                            <Col xs={9}>
                                                <h5>{item.nome}</h5>

                                                <p className="mb-0">
                                                    Preço: {Number(item.preco * item.quantidadeCarrinho).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </p>
                                            </Col>
                                            <Col xs={3} className="text-end">
                                                {item.imagens && item.imagens.length > 0 && (
                                                    <Image
                                                        src={`http://localhost:8080${item.imagens[0].url}`}
                                                        alt={item.nome}
                                                        fluid
                                                        rounded
                                                        style={{ maxHeight: '75px' }}
                                                    />
                                                )}
                                            </Col>
                                        </Row>
                                        <div className="d-flex gap-2 align-content-center">
                                            <button style={{ backgroundColor: '#34495E' }} className="btn text-white">-</button >
                                            <span className="d-flex align-items-center justify-content-center">{`${item.quantidadeCarrinho}`}</span>
                                            <button className="btn text-white" style={{ backgroundColor: '#34495E' }}>+</button>
                                            
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Seu carrinho está vazio.</p>
                            )}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="p-3 bg-white shadow-sm rounded">
                            <h4>Resumo do Pedido</h4>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <h5>Total:</h5>
                                <h5>
                                    {precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </h5>
                            </div>
                        </div>
                    </Col>

                </Row>
            </Container>
        </div>
    );
}

export default Carrinho;