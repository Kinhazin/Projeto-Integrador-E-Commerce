import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalLogin from "../components/home/ModalLogin";
import ModalCadastro from "../components/home/ModalCadastro";
import HeaderDefault from "../components/default/HeaderDefault";
import { Container, Row, Col, Image } from "react-bootstrap";

function Pedidos() {
  const location = useLocation();
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const { pessoa } = location.state || {};

  async function getPedidos() {
    try {
      const resp = await fetch(
        `http://localhost:8080/api/produtos/por-pessoa/${pessoa.id}`
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
            const imagemPrincipal =
              pedido.imagens.find((img) => img.principal == true) ||
              "https://via.placeholder.com/150";

            return (
              <div className="w-75 shadow bg-white rounded-1 mb-3">
                <Row className="p-3">
                  <Col xs={9}>
                    <p className=" fs-6 fw-bold text-muted mb-0">
                      {pedido.nome}
                    </p>
                    <p className=" fw-bold text-muted mb-0">
                      Valor:{" "}
                      <span className="fw-semibold">R$ {pedido.preco}</span>
                    </p>
                    <p className="fw-bold text-muted mb-0">
                      Quantidade: <span className="fw-semibold">1</span>
                    </p>
                  </Col>
                  <Col xs={3}>
                    <Image
                      src={
                        "http://localhost:8080" + imagemPrincipal.url ??
                        "https://via.placeholder.com/150"
                      }
                      fluid
                      rounded
                      style={{ maxHeight: "75px" }}
                    />
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
        />
      )}
    </div>
  );
}
export default Pedidos;
