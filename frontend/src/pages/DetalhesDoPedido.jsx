import HeaderDefault from "../components/default/HeaderDefault"
import { useLocation } from "react-router-dom";
import ModalCadastro from "../components/home/ModalCadastro";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

function DetalhesDoPedido() {
    const location = useLocation();
    const { pessoa, pedido } = location.state || {};
    const [showModalCadastro, setShowModalCadastro] = useState(false);
    const [produtosPedido, setProdutosPedido] = useState([]);
    const [endereco, setEndereco] = useState(null);

    async function getEnderecoDoPedido() {
        try {
            const response = await fetch(`http://localhost:8080/api/enderecos/${pedido?.enderecoId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar endereço do pedido');
            }
            const data = await response.json();
            setEndereco(data);
            console.log('Endereço do pedido:', data);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    async function getProdutosDoPedido() {
        try {
            const response = await fetch(`http://localhost:8080/api/produtos/por-pedido/${pedido?.id}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos do pedido');
            }
            const data = await response.json();
            setProdutosPedido(data);
            console.log('Produtos do pedido:', data);
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    useEffect(() => {
        getProdutosDoPedido();
        getEnderecoDoPedido();
    }, [pedido]);

    return (
        <div
            style={{ backgroundColor: "#EDEFF2" }}
            className="min-vh-100 d-flex flex-column"
        >
            <HeaderDefault
                openModalLogin={() => setShowModalCadastro(true)}
                pessoa={pessoa}
            />
            {
                pedido ? (
                    <div className="container mt-5">
                        <h2>Detalhes do Pedido #{pedido.numeroPedido}</h2>
                        <Container className="bg-white p-4 mb-3 rounded shadow-sm">
                            <h5>Status do pedido: <p className="fs-5 text-muted"> {pedido.status}</p></h5>
                            <h5>Forma de pagamento: <p className="fs-5 text-muted"> {pedido.formaPagamento}</p></h5>
                            <h5>Valor Total: <p className="fs-5 text-muted"> R$ {pedido.valorTotal}</p></h5>
                            <h5>Data de Criação: <p className="fs-5 text-muted"> {new Date(pedido.dataCriacao).toLocaleDateString()}</p></h5>
                            <h5>Endereço de entrega: <p className="fs-5 text-muted">{`${endereco?.logradouro} - ${endereco?.numero}, ${endereco?.bairro} ${endereco?.cep} - ${endereco?.cidade}, ${endereco?.estado}`}</p></h5>
                            {console.log(pedido)}
                        </Container>
                        <h5>Itens do Pedido:</h5>
                        {produtosPedido && produtosPedido.length > 0 ? (
                            produtosPedido.map((item, index) => (
                                <Container key={index} className=" w-100 shadow-sm p-3 border rounded">
                                    <p className="mb-0"><strong>Produto:</strong> {item.nome}</p>
                                    <p className="mb-0"><strong>Quantidade:</strong> {pedido.itens[index].quantidade}</p>
                                    <p className="mb-0"><strong>Valor total:</strong>{Number(pedido.itens[index].total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                </Container>
                            ))
                        ) : (
                            <p className="text-muted">Nenhum item encontrado neste pedido.</p>
                        )}
                    </div>
                ) : (
                    <div className="container mt-5">
                        <h2>Nenhum pedido selecionado.</h2>
                    </div>
                )
            }
            {showModalCadastro && (
                <ModalCadastro
                    show={showModalCadastro}
                    onHide={() => setShowModalCadastro(false)}
                    usuario={pessoa}
                />
            )}
        </div>
    )
}

export default DetalhesDoPedido;