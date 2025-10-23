import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

function ModalLogin(props){
    const metodos = useForm(); 

    function handleSubmit(data){
        console.log(data);
    }
    
return (
   <Modal show={props.show} onHide={props.onHide} centered size="lg">
          <Modal.Header
        style={{ backgroundColor: "#34495E" }}
        className="text-white border-none"
        closeButton
      >
        <Modal.Title>Entre na sua conta</Modal.Title>
      </Modal.Header>
       <Modal.Body
        className="w-100 text-white d-flex flex-column align-content-center justify-content-center"
        style={{ backgroundColor: "#EDEFF2" }}
      >
        <div className=" d-flex align-items-center justify-content-center flex-column gap-4">
        <h2 className="w-100 text-center" style={{color:'#34495E'}}>Login</h2>
        <Form onSubmit={metodos.handleSubmit(handleSubmit)} className="w-100 d-flex align-items-center justify-content-center flex-column gap-4">
        <Form.Group className="col-8">
        <Form.Label className="fs-5 fw-medium" style={{color:'#34495E'}}>E-mail</Form.Label>
        <Form.Control
        type="email"
        {...metodos.register("email")}
        required
        placeholder="Digite seu e-mail"
        />
        </Form.Group>
        <Form.Group className="col-8">
        <Form.Label className="fs-5 fw-medium" style={{color:'#34495E'}}>Senha</Form.Label>
        <Form.Control
        type="password"
        required
        placeholder="Digite sua senha"
        {...metodos.register("senha")}
        />
        </Form.Group>
          <button style={{background: '#34495E'}} className="btn text-white col-3 fw-medium">Entrar</button>
        </Form>
        <p style={{color:'#34495E'}}>Não possui uma conta? <b 
        onClick={()=>{
          props.onHide()
          props.abrirCadastro()
          }}
        role="button">Clique aqui</b></p>
        </div>
      </Modal.Body>
   </Modal>
)
}

export default ModalLogin;

