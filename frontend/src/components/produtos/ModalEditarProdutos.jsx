import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function ModalEditarProduto({ show, onHide, produto, onSaved, getProdutos, grupo }) {
    const metodo = useForm();
    const [saving, setSaving] = useState(false);
    const propsSomenteLeitura = grupo !== "administrativo" ? { readOnly: true } : {};
    const API_BASE = "http://localhost:8080/api";

        const ENDPOINTS = {
        UPDATE_PRODUCT: (id) => `${API_BASE}/produtos/${id}`,
        ADD_IMAGES:     (id) => `${API_BASE}/produtos/com-imagens/${id}/adicionar`,
        SET_PRINCIPAL:  (imageId) => `${API_BASE}/imagens/${imageId}/principal`,
        DELETE_IMAGE:   (imageId) => `${API_BASE}/imagens/${imageId}`,
    };

    useEffect(() => {
        if (produto) {
            metodo.reset({
                id: produto.id,
                nome: produto.nome,
                descricao: produto.descricao,
                preco: produto.preco,
                avaliacao: produto.avaliacao,
                estoque: produto.quantidadeEstoque,
                imagens: undefined, 
            });
        }
    }, [produto, metodo]);

    const atualizarProduto = async (data) => {
        const payload = {
            id: produto.id,
            nome: data.nome?.trim(),
            descricao: (data.descricao ?? "").trim(),
            preco: data.preco !== undefined ? Number(data.preco) : 0,
            avaliacao: data.avaliacao !== undefined ? Number(data.avaliacao) : 0,
            quantidadeEstoque: data.estoque !== undefined ? Number(data.estoque) : 0,
        };

        const resp = await fetch(ENDPOINTS.UPDATE_PRODUCT(produto.id), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if (!resp.ok) {
            const txt = await resp.text();
            throw new Error(`Falha ao atualizar produto: ${resp.status} ${txt}`);
        }
        onHide();
        getProdutos()
        return resp.json().catch(() => null); 
    };

    const uploadImagens = async (files) => {
        if (!files || files.length === 0) return;

        const formData = new FormData();

        Array.from(files).forEach((file) => {
            formData.append("imagens", file);
        });

        const resp = await fetch(ENDPOINTS.ADD_IMAGES(produto.id), {
            method: "POST",
            credentials: "include",
            body: formData, 
        });

        if (!resp.ok) {
            const txt = await resp.text();
            throw new Error(`Falha ao enviar imagens: ${resp.status} ${txt}`);
        }
        
        return resp.json().catch(() => null);
    };

    const setPrincipal = async (imagemId) => {
        try {
            const resp = await fetch(ENDPOINTS.SET_PRINCIPAL(imagemId), {
                method: "PATCH",
                credentials: "include",
            });
            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`Falha ao definir principal: ${resp.status} ${txt}`);
            }

            if (onSaved) onSaved();
             getProdutos()
             onHide();
            alert("Imagem definida como principal!");
        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao definir imagem principal");
        }
    };

    const deletarImagem = async (imagemId) => {
        if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;

        try {
            const resp = await fetch(ENDPOINTS.DELETE_IMAGE(imagemId), {
                method: "DELETE",
                credentials: "include",
            });
            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`Falha ao excluir imagem: ${resp.status} ${txt}`);
            }
            if (onSaved) onSaved();
             getProdutos()
             onHide();
            alert("Imagem excluída com sucesso!");
        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao excluir imagem");
        }
    };

    const onSubmit = metodo.handleSubmit(async (data) => {
        setSaving(true);
        try {
            await atualizarProduto(data);

            const files = data.imagens; 
            if (files && files.length > 0) {
                await uploadImagens(files);
            }

            if (onSaved) onSaved(); 
            getProdutos();
            alert("Produto atualizado com sucesso!");
            onHide?.();
        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao salvar alterações");
        } finally {
            setSaving(false);
        }
    });

    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header
                style={{ backgroundColor: "#34495E" }}
                className="text-white border-none"
                closeButton
            >
                <Modal.Title>Editar Produto</Modal.Title>
            </Modal.Header>

            <Modal.Body
                className="w-100 text-white d-flex flex-column align-content-center justify-content-center"
                style={{ backgroundColor: "#EDEFF2" }}
            >
                <Form
                    id="form-editar-produto"
                    className="w-100 px-4"
                    encType="multipart/form-data"
                    onSubmit={onSubmit}
                >
                    <Form.Control type="hidden" {...metodo.register("id")} />

                    <div className="row">
                        <Form.Group className="mb-3 col-md-6" controlId="nome">
                            <Form.Label style={{ color: "#34495E" }}>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                maxLength="200"
                                required
                                {...metodo.register("nome")}
                                {...propsSomenteLeitura}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-3" controlId="avaliacao">
                            <Form.Label style={{ color: "#34495E" }}>Avaliação</Form.Label>
                            <Form.Control
                                type="number"
                                min="0.5"
                                max="5"
                                step="0.5"
                                required
                                {...metodo.register("avaliacao")}
                                {...propsSomenteLeitura}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-3" controlId="preco">
                            <Form.Label style={{ color: "#34495E" }}>Preço</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                {...metodo.register("preco")}
                                {...propsSomenteLeitura}
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3" controlId="descricao">
                        <Form.Label style={{ color: "#34495E" }}>Descrição</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            maxLength="2000"
                            required
                            {...metodo.register("descricao")}
                            {...propsSomenteLeitura}
                        />
                    </Form.Group>

                    <div className="row">
                        <Form.Group className="mb-3 col-md-4" controlId="estoque">
                            <Form.Label style={{ color: "#34495E" }}>Quantidade em Estoque</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                required
                                {...metodo.register("estoque")}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 col-md-4" controlId="imagens">
                            <Form.Label style={{ color: "#34495E" }}>Adicionar Imagens</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                {...metodo.register("imagens")}
                                {...propsSomenteLeitura}
                            />
                        </Form.Group>

                        <div className="d-flex flex-wrap gap-3 mb-3">
                            {produto?.imagens?.map((imagem) => (
                                <div key={imagem.id} className="position-relative" style={{ width: '120px' }}>
                                    <img
                                        src={"http://localhost:8080" + imagem.url}
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
                        style={{ backgroundColor: "#34495E" }}
                        disabled={saving}
                    >
                        {saving ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalEditarProduto;