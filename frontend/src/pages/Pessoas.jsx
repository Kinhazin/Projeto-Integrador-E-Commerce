import { Table } from "react-bootstrap";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { useWatch } from "react-hook-form";
import ModalAdicionarPessoas from "../components/pessoas/ModalAdicionarPessoas";
import ModalEditarCliente from "../components/pessoas/ModalEditarPessoas";

function Pessoas() {
  const [pessoas, setPessoas] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modalEditarShow, setModalEditarShow] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const totalPaginas = Math.ceil(pessoas.length / itensPorPagina);

  const metodo = useForm();

  const pessoasFiltradas = useWatch({
    control: metodo.control,
    name: "pessoasFiltradas",
    defaultValue: "",
  });
  
  const pessoasFiltradasLista = pessoas.filter(
    (pessoa) =>
      pessoa.nome.toLowerCase().includes(pessoasFiltradas.toLowerCase()) ||
      pessoa.email.toLowerCase().includes(pessoasFiltradas.toLowerCase())
  );
  let itensPagina = pessoasFiltradasLista.slice(
    indicePrimeiroItem,
    indiceUltimoItem
  );

  function atribuirCorStatus(status) {
    switch (status) {
      case "ativo":
        return "btn-danger";
      default:
        return "btn-success";
    }
  }

  const getPessoas = async () => {
    const reponse = await fetch("http://localhost:8080/api/pessoas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await reponse.json();
    setPessoas(data);
  };

  useEffect(
    () => {
      getPessoas();
    },
    [],
    [pessoas]
  );

  const alterarStatus = async (id) => {
    try {
      if (confirm("Deseja realmente alterar o status?") == false) {
        throw new Error("Status não alterado");
      }

      const response = await fetch(
        `http://localhost:8080/api/pessoas/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao alterar status");
      } else {
        getPessoas();
      }
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#EDEFF2",
        minHeight: "100%",
        minWidth: "100%",
      }}
      className="h-100 d-flex justify-content-start align-items-center text-light flex-column gap-5"
    >
      <div style={{ maxHeight: "20%", transform: "translateY(100%)" }}>
        <h1 style={{ color: "#34495E" }}>Usuários cadastrados</h1>
      </div>
      <div className="w-100 h-50 d-flex justify-content-start align-items-center flex-column">
        <div
          style={{ width: "80%" }}
          className="d-flex justify-content-end mb-3"
        >
          <div style={{ width: "20%" }}>
            <Form.Control
              type="search"
              placeholder="Pesquisar"
              {...metodo.register("pessoasFiltradas")}
            />
          </div>
        </div>
        <Table striped bordered hover variant="light" style={{ width: "80%" }}>
          <thead>
            <tr>
              <th className="col-1 text-center">ID</th>
              <th className="col-2 text-center">Nome</th>
              <th className="col-3 text-center">E-mail</th>
              <th className="col-2 text-center">Status</th>
              <th className="col-2 text-center">Grupo</th>
              <th className="col-3 text-center">Editar</th>
              <th style={{ width: "25px" }}>
                <CirclePlus onClick={() => setModalShow(true)} />
              </th>
            </tr>
          </thead>
          <tbody>
            {itensPagina.map((pessoa) => (
              <tr key={pessoa.id}>
                <td className="text-center">{pessoa.id}</td>
                <td className="text-center">{pessoa.nome}</td>
                <td className="text-center">{pessoa.email}</td>
                <td className="text-center">{pessoa.status}</td>
                <td className="text-center">{pessoa.grupo}</td>
                <td colSpan={2} className="text-center">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => {
                      setClienteSelecionado(pessoa);
                      setModalEditarShow(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => alterarStatus(pessoa.id, pessoa.status)}
                    type="button"
                    className={`btn ${atribuirCorStatus(pessoa.status)} `}
                  >
                    {pessoa.status == "ativo" ? "Inativar" : "Ativar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() =>
              setPaginaAtual(paginaAtual > 1 ? paginaAtual - 1 : 1)
            }
            style={{ backgroundColor: "#34495E" }}
          >
            Anterior
          </button>
          <span style={{color: '#34495E'}}>Página {paginaAtual}</span>
          <button
            className="btn btn-primary ms-2"
            onClick={() =>
              setPaginaAtual(
                paginaAtual == totalPaginas ? paginaAtual : paginaAtual + 1
              )
            }
            style={{ backgroundColor: "#34495E" }}
          >
            Próxima
          </button>
        </div>
      </div>
      <ModalAdicionarPessoas
        show={modalShow}
        onHide={() => setModalShow(false)}
        pessoas={pessoas}
        getPessoas={getPessoas}
      />

      <ModalEditarCliente
        show={modalEditarShow}
        onHide={() => setModalEditarShow(false)}
        clienteSelecionado={clienteSelecionado}
        getPessoas={getPessoas}
        pessoas={pessoas}
      />
    </div>
  );
}

export default Pessoas;
