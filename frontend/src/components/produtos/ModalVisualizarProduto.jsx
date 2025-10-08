import { Modal } from "react-bootstrap";
import Produtos from "../../pages/Produtos";

function ModalVisualizarProduto(props) {
    
  const { produto } = props;
  const imagemPrincipal = produto.imagens?.find(imagem => imagem.principal === true) ?? produto.imagens[0];
  console.log(produto.imagens)
  return (
    <Modal show={props.show} onHide={props.onHide} centered size="lg">
      <Modal.Header
        style={{ backgroundColor: "#34495E" }}
        className="text-white border-none"
        closeButton
      >
        <Modal.Title>Visualizar produto</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="w-100 text-white d-flex flex-row align-content-center gap-5"
        style={{ backgroundColor: "#EDEFF2" }}
      >
        <section style={{ height: "250px", width: "250px" }} className="shadow">
          {console.log(imagemPrincipal)}

          {produto.imagens && produto.imagens.length > 0 ? (

            <img
              className="w-100 h-100"
              src={"http://localhost:8080" + imagemPrincipal.url }
              alt="Imagem do produto"
            />
          ) : (
            <p className="text-dark h-100 w-100 d-flex align-items-center justify-content-center fw-bold">Sem imagem</p>
          )}
        </section>
        <section className="text-dark">
          <div className="d-flex flex-row gap-1">
            <p className="text-dark fw-bold">Nome do produto:</p>
            {produto.nome}
          </div>
          <div className="d-flex flex-row gap-1">
            <p className="text-dark fw-bold">Preço:</p>
            R$ {produto.preco}
          </div>
          <div className="d-flex flex-column">
            <p className="text-dark fw-bold m-0">Descrição:</p>
            {produto.descricao}
          </div>
          <div className="d-flex flex-row gap-1 pt-2 ">
            <p className="text-dark fw-bold ">Nota:</p>
            {produto.avaliacao}
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
}
export default ModalVisualizarProduto;
