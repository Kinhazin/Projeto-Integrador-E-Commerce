import { Form } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { CirclePlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import ModalAdicionarProduto from "../components/produtos/ModalAdicionarProduto";
import ModalEditarProduto from "../components/produtos/ModalEditarProdutos";

function Produtos() {
  const metodo = useForm({ defaultValues: { produtosFiltrados: "" } });
  const [produtos, setProdutos] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [modalShowEditar, setModalShowEditar] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const itensPorPagina = 10;

  const itensFiltrados = useWatch({
    control: metodo.control,
    name: "produtosFiltrados",
    defaultValue: "",
  });

const normalize = (s) =>
    (s ?? "")
      .toString()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  const termoBusca = normalize(itensFiltrados);

  const produtoFiltrado = useMemo(() => {
    return produtos.filter((produto) => normalize(produto?.nome).includes(termoBusca));
  }, [produtos, termoBusca]);

  const totalPaginas = Math.max(1, Math.ceil(produtoFiltrado.length / itensPorPagina));
  const indicePrimeiroItem = (paginaAtual - 1) * itensPorPagina;

  const produtosPagina = useMemo(() => {
    return produtoFiltrado.slice(indicePrimeiroItem, indicePrimeiroItem + itensPorPagina);
  }, [produtoFiltrado, indicePrimeiroItem, itensPorPagina]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);
  
  const getProdutos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/produtos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Falha ao carregar produtos (${response.status}): ${text}`);
      }
      const data = await response.json();
      setProdutos(data ?? []);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setProdutos([]);
    }
  };

  function atribuirCorStatus(status) {
    return (status ?? "").toLowerCase() === "ativo" ? "btn-danger" : "btn-success";
  }

  const alterarStatus = async (id) => {
    try {
      const confirmar = confirm("Deseja realmente alterar o status deste produto?");
      if (!confirmar) throw new Error("Operação cancelada pelo usuário");

      const response = await fetch(`http://localhost:8080/api/produtos/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Falha ao alterar status (${response.status}): ${text}`);
      }

      await getProdutos();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    getProdutos();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#EDEFF2",
        minHeight: "100%",
        minWidth: "100%",
      }}
      className="d-flex justify-content-start align-items-center text-light flex-column gap-5"
    >
      <div style={{ maxHeight: "20%", transform: "translateY(100%)" }}>
        <h1 style={{ color: "#34495E" }}>Produtos cadastrados</h1>
      </div>

      <div className="w-100 h-100 d-flex justify-content-center align-items-center flex-column gap-1">
        <div style={{ width: "80%" }} className="d-flex justify-content-end mb-3">
          <div style={{ width: "20%" }}>
            <Form.Control
              type="search"
              placeholder="Pesquisar"
              {...metodo.register("produtosFiltrados")}
            />
          </div>
        </div>

        <Table striped bordered hover variant="light" style={{ width: "80%" }}>
          <thead>
            <tr>
              <th className="col-2 text-center">Código do produto</th>
              <th className="col-2 text-center">Nome do produto</th>
              <th className="col-2 text-center">Estoque</th>
              <th className="col-2 text-center">Valor</th>
              <th className="col-2 text-center">Status</th>
              <th className="col-3 text-center">Editar</th>
              <th style={{ width: "25px" }}>
                <CirclePlus onClick={() => setModalShow(true)} style={{ cursor: "pointer" }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {produtosPagina.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              produtosPagina.map((produto) => (
                <tr key={produto.id}>
                  <td className="text-center">{produto.id}</td>
                  <td className="text-center">{produto.nome}</td>
                  <td className="text-center">{produto.quantidadeEstoque}</td>
                  <td className="text-center">{produto.preco}</td>
                  <td className="text-center">{produto.status}</td>
                  <td colSpan={2} className="text-center">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => {
                        setModalShowEditar(true);
                        setProdutoSelecionado(produto);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => alterarStatus(produto.id)}
                      className={`btn ${atribuirCorStatus(produto.status)}`}
                    >
                      {produto.status === "ativo" ? "Inativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <div>
          <button
            className="btn btn-primary me-2"
            style={{ backgroundColor: "#34495E" }}
            disabled={paginaAtual <= 1}
            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>

          <span style={{ color: "#34495E" }}>Página {paginaAtual}</span>

          <button
            className="btn btn-primary ms-2"
            style={{ backgroundColor: "#34495E" }}
            disabled={paginaAtual >= totalPaginas}
            onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
          >
            Próxima
          </button>
        </div>
      </div>

      {modalShow && (
        <ModalAdicionarProduto
          show={modalShow}
          onHide={() => setModalShow(false)}
          getProdutos={getProdutos}
        />
      )}

      {modalShowEditar && (
        <ModalEditarProduto
          produto={produtoSelecionado}
          show={modalShowEditar}
          onHide={() => setModalShowEditar(false)}
          getProdutos={getProdutos}
        />
      )}

      <footer></footer>
    </div>
  );
}

export default Produtos;
