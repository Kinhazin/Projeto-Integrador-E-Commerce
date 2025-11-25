import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalLogin from "../components/home/ModalLogin";
import ModalCadastro from "../components/home/ModalCadastro";
import HeaderDefault from "../components/default/HeaderDefault";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Pedidos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const { pessoa } = location.state || {};

  function converterDataISO(isoString) {
    const data = new Date(isoString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }

  async function getPedidos() {
    try {
      const resp = await fetch(
        `http://localhost:8080/api/pedidos/por-pessoa/${pessoa.id}`
      );
      if (resp.ok) {
        const data = await resp.json();
        console.log(data);
        setPedidos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  }

  useEffect(() => {
    getPedidos();
  }, []);

  return (
    <div
      style={{ backgroundColor: "#EDEFF2" }}
      className="min-vh-100 d-flex flex-column"
    >
      <HeaderDefault
        openModalLogin={() => setShowModalCadastro(true)}
        pessoa={pessoa}
      />
      <Container className="d-flex flex-column align-items-center mt-5">
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => {
            return (
              <div className="w-75 shadow bg-white rounded-1 mb-3">
                <Row className="p-3">
                  <Col xs={9}>
                    <p className=" fs-6 fw-bold text-muted mb-0">
                      {pedido.numeroPedido}
                    </p>
                    <p className=" fw-bold text-muted mb-0">
                      Valor:{" "}
                      <span className="fw-semibold">R$ {pedido.valorTotal}</span>
                    </p>
                    <p className="fw-bold text-muted mb-0">
                      Status: <span className="fw-semibold">{pedido.status}</span>
                    </p>
                  </Col>
                  <Col xs={3} className="d-flex flex-column gap-3">
                    <span className="fw-semibold">{converterDataISO(pedido.dataCriacao)}</span>
                    <button className="btn border border-1"
                      onClick={() => navigate("/detalhes-pedido", { state: { pessoa: pessoa, pedido : pedido} })}
                    >Detalhes</button>
                  </Col>
                </Row>
              </div>
            );
          })
        ) : (
          <>Sem pedidos</>
        )}
      </Container>
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
          usuario={pessoa}
        />
      )}
    </div>
  );
}
export default Pedidos;
