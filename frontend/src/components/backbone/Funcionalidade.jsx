import { useNavigate } from "react-router-dom";

function Funcionalidade(props){
    const navigate = useNavigate();

    return(
        <div
        onClick={() => navigate(props.rota? props.rota : '/backbone')} 
        className={`d-${props.display} h-100 bg-dark rounded d-flex align-items-center justify-content-center suave-transition`} style={{width: '25%'}}>
        <p className="fs-3">{props.texto}</p>
        </div>
    )
}

export default Funcionalidade;