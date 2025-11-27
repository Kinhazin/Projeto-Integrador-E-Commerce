import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";

function ModalPedido({ pedido, show, handleClose, fetchPedidos }) {
    const metodos = useForm();
    metodos.setValue("status", pedido.status.replace(/"/g, ''));

    async function onSubmit(data) {
        try {
            const response = await fetch(`http://localhost:8080/api/pedidos/${pedido.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data.status),
            });

            if (response.ok) {
                alert('Status do pedido atualizado com sucesso');
                fetchPedidos();
                handleClose();
            } else {
                throw new Error('Erro na resposta do servidor');
            }
        } catch (error) {
            alert('Erro ao atualizar status do pedido');
        }
    }

    return (
        <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Detalhes do Pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={metodos.handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Número do Pedido</Form.Label>
                                <Form.Control type="text" readOnly value={pedido.numeroPedido} />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Data de pedido</Form.Label>
                                <Form.Control type="text" readOnly value={new Date(pedido.dataCriacao).toLocaleDateString()} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Valor total</Form.Label>
                                <Form.Control type="text" readOnly value={`R$ ${pedido.valorTotal.toFixed(2)}`} />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Status do pedido</Form.Label>
                                <Form.Select
                                    {...metodos.register("status")}
                                    >
                                    <option>aguardando pagamento</option>
                                    <option>pagamento rejeitado</option>
                                    <option>pagamento com sucesso</option>
                                    <option>aguardando retirada</option>
                                    <option>aguardando retirada</option>
                                    <option>em transito</option>
                                    <option>entregue</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="ms-auto d-flex justify-content-end" sm={8}>
                            <Button type="submit" className="w-25 justify-content-end">Alterar</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
export default ModalPedido;