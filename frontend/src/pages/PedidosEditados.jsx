import { Table } from "react-bootstrap";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

function PedidosEditados() {
    const [pedidos, setPedidos] = useState([]);
    const itensPorPagina = 10;
    const [paginaAtual, setPaginaAtual] = useState(1);
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const totalPaginas = Math.ceil(pedidos.length / itensPorPagina);


    let itensPagina = pedidos.slice(
        indicePrimeiroItem,
        indiceUltimoItem
    );



    async function fetchPedidos() {
        try {
            const response = await fetch('http://localhost:8080/api/pedidos');
            const data = await response.json();
            setPedidos(data);
            console.log(data);
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
        }
    }

    useEffect(() => {
        fetchPedidos();
    }, []);

    return (
        <div
            style={{ backgroundColor: "#EDEFF2" }}
            className="min-vh-100 d-flex flex-column align-items-center  pt-5"
        >
            <Table className="mt-5" striped bordered hover variant="light" style={{ width: "80%" }}>
                <thead>
                    <tr>
                        <th className="col-1 text-center">ID</th>
                        <th className="col-2 text-center">Nº do pedido</th>
                        <th className="col-3 text-center">Data de pedido</th>
                        <th className="col-2 text-center">Valor total</th>
                        <th className="col-2 text-center">Status</th>
                        <th className="col-3 text-center">Editar</th>
                        <th style={{ width: "25px" }}>
                            <CirclePlus />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                            <td className="text-center">{pedido.id}</td>
                            <td className="text-center">{pedido.numeroPedido}</td>
                            <td className="text-center">{new Date(pedido.dataCriacao).toLocaleDateString()}</td>
                            <td className="text-center">R$ {pedido.valorTotal.toFixed(2)}</td>
                            <td className="text-center">{pedido.status}</td>
                            <td colSpan={2} className="text-center">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div>
                <button
                    className="btn btn-primary me-2"

                    style={{ backgroundColor: "#34495E" }}
                    onClick={() =>
                        setPaginaAtual(paginaAtual > 1 ? paginaAtual - 1 : 1)
                    }
                >

                    Anterior
                </button>
                <span style={{ color: '#34495E' }}>Página {paginaAtual} </span>
                <button
                    className="btn btn-primary ms-2"
                    style={{ backgroundColor: "#34495E" }}
                    onClick={() =>
                        setPaginaAtual(
                            paginaAtual == totalPaginas ? paginaAtual : paginaAtual + 1
                        )
                    }
                >
                    Próxima
                </button>
            </div>
        </div>
    )
}
export default PedidosEditados;