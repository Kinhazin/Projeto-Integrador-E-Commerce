import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderDefault from "../components/default/HeaderDefault";
import { Container, Row, Col, Spinner, Modal, Button } from "react-bootstrap";
import ModalPagamento from "../components/home/ModalPagamento";

function ResumoPedido() {
    const location = useLocation();
    const navigate = useNavigate();
    const { pessoa, carrinho, total, enderecos, pagamento: pagamentoInicial, enderecoSelecionadoCliente } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [showModalPagamento, setShowModalPagamento] = useState(false);
    const [pagamento, setPagamento] = useState(pagamentoInicial || {});
    const [showModal, setShowModal] = useState(false);
    const [pedidoInfo, setPedidoInfo] = useState(null);
    const [erro, setErro] = useState(null);

    if (!carrinho || carrinho.length === 0) {
        navigate("/");
        return null;
    }

    // Calcula subtotal de produtos
    const valorProdutos = carrinho.reduce((acc, item) => {
        const preco = parseFloat(item.preco) || 0;
        const qtd = parseInt(item.quantidadeCarrinho) || 1;
        return acc + preco * qtd;
    }, 0);

    // Total final vindo do Checkout ou calculado
    const totalFinal = parseFloat(total) || valorProdutos || 0;

    const enderecoSelecionado = enderecos?.find(e => e.id == enderecoSelecionadoCliente) || enderecos?.[0];

    const handleConcluirCompra = async () => {
        if (!pagamento?.formaPagamento) {
            alert("Selecione uma forma de pagamento antes de concluir a compra.");
            setShowModalPagamento(true);
            return;
        }

        setLoading(true);
        setErro(null);

        try {
            const pedidoData = {
                pessoa: { id: pessoa.id },
                enderecoId: enderecoSelecionado?.id,
                formaPagamento: pagamento.formaPagamento,
                valorTotal: totalFinal,
                status: "aguardando pagamento",
                itens: carrinho.map(item => ({
                    produtoId: item.id,
                    quantidade: parseInt(item.quantidadeCarrinho) || 1,
                    precoUnitario: parseFloat(item.preco) || 0,
                })),
            };

            console.log(pedidoData)

            const response = await fetch("http://localhost:8080/api/pedidos/criar", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoData),
            });

            if (response.ok) {
                const data = await response.json();
                setPedidoInfo({
                    numero: data.numeroPedido,
                    total: totalFinal.toFixed(2).replace(".", ","),
                });
                setShowModal(true);
            } else {
                const errText = await response.text();
                setErro("Erro ao criar pedido: " + errText);
                setShowModal(true);
            }
        } catch (error) {
            setErro("Erro ao conectar com o servidor: " + error.message);
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleFecharModal = () => {
        setShowModal(false);
        if (!erro) navigate("/homepagelogado", { state: { pessoa: pessoa } });
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#EDEFF2" }}>
            <HeaderDefault pessoa={pessoa} />
            <Container className="py-5">
                <Row>
                    <Col md={8}>
                        <div className="bg-light rounded-1 shadow-sm p-4">
                            <h4 className="fw-bold mb-3">Resumo do Pedido</h4>

                            {carrinho.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between border-bottom py-2">
                                    <span>{item.nome} ({item.quantidadeCarrinho || 1}x)</span>
                                    <span>R$ {(item.preco * (item.quantidadeCarrinho || 1)).toFixed(2).replace(".", ",")}</span>
                                </div>
                            ))}

                            <div className="mt-4">
                                <p>Subtotal: <strong>R$ {valorProdutos.toFixed(2).replace(".", ",")}</strong></p>
                                <p className="fs-5">Total: <strong>R$ {totalFinal.toFixed(2).replace(".", ",")}</strong></p>
                            </div>

                            <div className="mt-4">
                                <h5 className="fw-bold">Endereço de entrega</h5>
                                {enderecoSelecionado ? (
                                    <p>
                                        {enderecoSelecionado.logradouro}, {enderecoSelecionado.numero} - {enderecoSelecionado.cidade}/{enderecoSelecionado.estado} - CEP {enderecoSelecionado.cep}
                                    </p>
                                ) : (<p>Nenhum endereço selecionado</p>)}
                            </div>

                            <div className="mt-3">
                                <h5 className="fw-bold">Forma de Pagamento</h5>
                                <p>{pagamento?.formaPagamento ? pagamento.formaPagamento.toUpperCase() : "Não informado"}</p>
                                <Button variant="outline-primary" onClick={() => setShowModalPagamento(true)}>
                                    Selecionar / Alterar Método
                                </Button>
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Voltar</button>
                                <button className="btn btn-success" onClick={handleConcluirCompra} disabled={loading}>
                                    {loading ? <Spinner size="sm" /> : "Concluir Compra"}
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Modal de pagamento */}
            <ModalPagamento
                show={showModalPagamento}
                onClose={() => setShowModalPagamento(false)}
                onConfirm={(dados) => setPagamento(dados)}
                total={totalFinal}
                initialFormaPagamento={pagamento?.formaPagamento}
            />

            {/* Modal de confirmação */}
            <Modal show={showModal} onHide={handleFecharModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{erro ? "❌ Erro ao Finalizar Pedido" : "✅ Pedido Concluído com Sucesso"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {erro ? (
                        <p>{erro}</p>
                    ) : (
                        <>
                            <p>Seu pedido foi registrado com sucesso!</p>
                            <p><strong>Número do Pedido:</strong> {pedidoInfo?.numero}</p>
                            <p><strong>Valor Total:</strong> R$ {pedidoInfo?.total}</p>
                            <p>Status inicial: <strong>Aguardando pagamento</strong></p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleFecharModal}>
                        {erro ? "Fechar" : "Voltar à Loja"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ResumoPedido;
