import { Form, Modal } from "react-bootstrap"
import { Table } from "react-bootstrap"
import { CirclePlus } from "lucide-react"
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import ModalAdicionarProduto from "../components/produtos/ModalAdicionarProduto";
import ModalEditarProduto from "../components/produtos/ModalEditarProdutos";

function Produtos() {

    const metodo = useForm();
    const [produtos, setProdutos] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const totalPaginas = Math.ceil(produtos.length / itensPorPagina);
    const [modalShowEditar, setModalShowEditar] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    const itensFiltrados = useWatch({
        control: metodo.control,
        name: "produtosFiltrados",
        defaultValue: ""
    });

    const produtoFiltrado = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(itensFiltrados.toLowerCase())
    );

    const produtosPagina = produtoFiltrado.slice(indicePrimeiroItem, indiceUltimoItem);

    const getProdutos = async () => {
        const reponse = await fetch('http://localhost:8080/api/produtos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (reponse.ok) {
            const data = await reponse.json();
            setProdutos(data);
        }
    }

    function atribuirCorStatus(status) {
        switch (status) {
            case 'ativo':
                return 'btn-danger';
            default:
                return 'btn-success';
        }
    }

    const alterarStatus = async (id) => {
        try {
            if (confirm("Deseja realmente alterar o status deste produto?") == false) {
                throw new Error('Operação cancelada pelo usuário');
            }

            const response = await fetch(`http://localhost:8080/api/produtos/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                getProdutos();
            }
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert(error.message);
        }
    }
    useEffect(() => {
        getProdutos();
    }, []);

    return (
        <div style={{ backgroundColor: '#1c1f23' }} className="h-100 d-flex justify-content-center align-items-center text-light flex-column gap-5">
            <div style={{ maxHeight: '20%', transform: 'translateY(100%)' }}>
                <h1>Usuários cadastrados</h1>
            </div>
            <div className="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
                <div style={{ width: '80%' }} className="d-flex justify-content-end mb-3">
                    <div style={{ width: '20%' }}>
                        <Form.Control
                            type="search"
                            placeholder="Pesquisar"
                            {...metodo.register("produtosFiltrados")}
                        /></div>
                </div>
                <Table striped bordered hover variant="dark" style={{ width: '80%' }}>
                    <thead>
                        <tr>
                            <th className="col-2 text-center">Codigo do produto</th>
                            <th className="col-2 text-center">Nome do produto</th>
                            <th className="col-2 text-center">Quantidade em estoque</th>
                            <th className="col-2 text-center">Valor</th>
                            <th className="col-2 text-center">Status</th>
                            <th className="col-3 text-center">Editar</th>
                            <th style={{ width: '25px' }}><CirclePlus
                                onClick={() => setModalShow(true)} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosPagina.map((produto) => (
                            <tr key={produto.id}>
                                <td className="text-center">{produto.id}</td>
                                <td className="text-center">{produto.nome}</td>
                                <td className="text-center">{produto.quantidadeEstoque}</td>
                                <td className="text-center">{produto.preco}</td>
                                <td className="text-center">{produto.status}</td>
                                <td colSpan={2} className="text-center">
                                    <button type="button"
                                        className="btn btn-secondary me-2"
                                        onClick={() => {
                                            setModalShowEditar(true);
                                            setProdutoSelecionado(produto);
                                        }}

                                    >Editar</button>
                                    <button type="button" onClick={() => alterarStatus(produto.id)} className={`btn ${atribuirCorStatus(produto.status)} `}>{produto.status == "ativo" ? "Inativar" : "Ativar"}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div>
                    <button className="btn btn-primary me-2" onClick={() => paginaAtual > 1 ? setPaginaAtual(paginaAtual - 1) : setPaginaAtual(paginaAtual)}>Anterior</button>
                    <span>Página {paginaAtual}</span>
                    <button className="btn btn-primary ms-2" onClick={() => paginaAtual < totalPaginas ? setPaginaAtual(paginaAtual + 1) : setPaginaAtual(paginaAtual)}>Próxima</button>
                </div>
            </div>
            <ModalAdicionarProduto show={modalShow} onHide={() => setModalShow(false)} getProdutos={getProdutos} />
            <ModalEditarProduto
                produto={produtoSelecionado}
                show={modalShowEditar}
                onHide={() => setModalShowEditar(false)} getProdutos={getProdutos}
            />

        </div >
    )
}
export default Produtos;