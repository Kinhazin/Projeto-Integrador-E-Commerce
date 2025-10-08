import { useNavigate } from "react-router-dom";

function Funcionalidade(props){
    const navigate = useNavigate();

    return(
        <div
        onClick={() => navigate(props.rota? props.rota : '/backbone')} 
        className={`d-${props.display} h-100 rounded d-flex align-items-center justify-content-center suave-transition`} style={{width: '25%', backgroundColor: '#34495E'}}>
        <p className="fs-4">{props.texto}</p>
        </div>
    )
}

export default Funcionalidade;