import { use } from "react";
import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

function ModalEditarProduto({ show, onHide, produto }) {
    console.log(produto)
    const metodo = useForm();
    useEffect(() => {
        if (produto) {
            metodo.reset({
                id: produto.id,
                nome: produto.nome,
                descricao: produto.descricao,
                preco: produto.preco,
                avaliacao: produto.avaliacao,
                estoque: produto.quantidadeEstoque,
                status: produto.status
            });
        }
    }, [produto]);


    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header
                style={{ backgroundColor: "#0B0E10" }}
                className="text-white border-none"
                closeButton
            >
                <Modal.Title>Editar Produto</Modal.Title>
            </Modal.Header>

            <Modal.Body
                className="w-100 text-white d-flex flex-column align-content-center justify-content-center"
                style={{ backgroundColor: "#191A1C" }}
            >
                <Form
                    id="form-editar-produto"
                    className="w-100 px-4"
                    encType="multipart/form-data"
                >
                    <Form.Control type="hidden" {...metodo.register("id")} />

                    <div className="row">
                        <Form.Group className="mb-3 col-md-6" controlId="nome">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                maxLength="200"
                                required
                                {...metodo.register("nome")}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-3" controlId="avaliacao">
                            <Form.Label>Avaliação</Form.Label>
                            <Form.Control
                                type="number"
                                min="0.5"
                                max="5"
                                step="0.5"
                                required
                                {...metodo.register("avaliacao")}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-3" controlId="preco">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                {...metodo.register("preco")}
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3" controlId="descricao">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            maxLength="2000"
                            required
                            {...metodo.register("descricao")}
                        />
                    </Form.Group>

                    <div className="row">
                        <Form.Group className="mb-3 col-md-4" controlId="estoque">
                            <Form.Label>Quantidade em Estoque</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                required
                                {...metodo.register("estoque")}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-4" controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select {...metodo.register("status")}>
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-4" controlId="imagens">
                            <Form.Label>Adicionar Imagens</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                {...metodo.register("imagens")}
                            />
                        </Form.Group>
                        <div className="d-flex flex-wrap gap-3 mb-3">
                            {produto?.imagens?.map((imagem) => (
                                <div key={imagem.id} className="position-relative" style={{ width: '120px' }}>
                                    <img
                                        src={imagem.url}
                                        alt="Imagem do produto"
                                        className="img-thumbnail"
                                        style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                                    />
                                    <div className="d-flex justify-content-between mt-1">
                                        <button
                                            type="button"
                                            className={`btn btn-sm ${imagem.principal ? 'btn-success' : 'btn-outline-primary'}`}
                                            onClick={() => setPrincipal(imagem.id)}
                                        >
                                            Principal
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deletarImagem(imagem.id)}
                                        >
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Form>

                <div className="w-100 d-flex justify-content-center mt-3">
                    <button
                        form="form-editar-produto"
                        type="submit"
                        className="btn text-white col-2"
                        style={{ backgroundColor: "#313132" }}
                    >
                        Salvar Alterações
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalEditarProduto;
