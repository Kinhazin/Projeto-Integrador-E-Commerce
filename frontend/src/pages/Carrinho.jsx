import { useState, useEffect } from 'react'; // Importar useState e useEffect
import HeaderDefault from "../components/default/HeaderDefault";
import { Row, Col, Container, Image } from "react-bootstrap";
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useWatch } from 'react-hook-form';


function Carrinho() {
    const [itensDoCarrinho, setItensDoCarrinho] = useState([]);
    const metodos = useForm();
    
    const taxa = useWatch({
        control: metodos.control,
        name: "frete",
        defaultValue: 0.15
    })

    useEffect(() => {
        const todasAsChaves = Object.keys(localStorage);
        const itensCarregados = todasAsChaves.map(chave => {
            try {
                const item = JSON.parse(localStorage.getItem(chave));
                // Validação para garantir que é um item de produto
                if (item && item.id && item.nome && item.preco && item.quantidadeCarrinho) {
                    return item;
                }
                return null;
            } catch (e) {
                console.error("Erro ao parsear item do localStorage:", e);
                return null;
            }
        }).filter(item => item !== null);

        setItensDoCarrinho(itensCarregados);
    }, []);

    const handleAumentarQuantidade = (itemId) => {
        const novosItens = itensDoCarrinho.map(item => {
            if (item.id === itemId) {
                const itemAtualizado = { ...item, quantidadeCarrinho: item.quantidadeCarrinho + 1 };
                // Atualiza o localStorage
                localStorage.setItem(String(item.id), JSON.stringify(itemAtualizado));
                return itemAtualizado;
            }
            return item;
        });
        setItensDoCarrinho(novosItens);
    };

    const handleRemoverDoCarrinho = (itemId) => {

        const novosItens = itensDoCarrinho.filter(item => item.id !== itemId);
        setItensDoCarrinho(novosItens);
        localStorage.removeItem(String(itemId));
    };
    const handleDiminuirQuantidade = (itemId) => {
        let itemParaRemover = false;
        let novosItens = itensDoCarrinho.map(item => {
            if (item.id === itemId) {
                if (item.quantidadeCarrinho > 1) {
                    const itemAtualizado = { ...item, quantidadeCarrinho: item.quantidadeCarrinho - 1 };

                    localStorage.setItem(String(item.id), JSON.stringify(itemAtualizado));
                    return itemAtualizado;
                } else {
                    itemParaRemover = true;
                    localStorage.removeItem(String(item.id));
                    return null;
                }
            }
            return item;
        }).filter(item => item !== null);

        setItensDoCarrinho(novosItens);
    };
    function novoValor(preco, taxa) {
        console.log(taxa)
        return preco + (preco * taxa);
    }

    const precoTotal = itensDoCarrinho.reduce((total, item) => {
        return total + (parseFloat(item.preco) * item.quantidadeCarrinho);
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
                                        <div className="d-flex gap-2 align-items-center mt-2">
                                            <button
                                                style={{ backgroundColor: '#34495E' }}
                                                className="btn text-white"
                                                onClick={() => handleDiminuirQuantidade(item.id)}
                                            >
                                                -
                                            </button>
                                            <span className="d-flex align-items-center justify-content-center" style={{ minWidth: '20px' }}>
                                                {item.quantidadeCarrinho}
                                            </span>
                                            <button
                                                className="btn text-white"
                                                style={{ backgroundColor: '#34495E' }}
                                                onClick={() => handleAumentarQuantidade(item.id)}
                                            >
                                                +
                                            </button>
                                            <button className='btn text-white'
                                                onClick={() => handleRemoverDoCarrinho(item.id)}
                                                style={{ backgroundColor: '#34495E' }}>Remover</button>
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
                            <Form.Select
                            {... metodos.register("frete")}
                            >
                                <option value="0.15">Entrega padrão</option>
                                <option value="0.20">Entrega expressa</option>
                                <option value="0.25">Entrega super rápida</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                        <div className="p-3 bg-white shadow-sm rounded">
                            <h4>Resumo do Pedido</h4>
                            <hr />
                            <div className="d-flex flex-column">
                                <div className='d-flex justify-content-between'>
                                    <h5>Total:</h5>
                                    <h5>
                                        {precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </h5>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <h5>Total com frete (15%):</h5>
                                    <h5>
                                        {novoValor(precoTotal, parseFloat(taxa)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Carrinho;