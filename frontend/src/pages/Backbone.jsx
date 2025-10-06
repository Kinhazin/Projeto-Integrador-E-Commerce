import Funcionalidade from "../components/backbone/Funcionalidade";
import { useLocation } from "react-router-dom";

function Backbone(props) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const grupo = queryParams.get('grupo');
  const display = grupo === 'adm' ? 'block' : 'none';

  return (
    <>
      <div style={{ backgroundColor: '#1c1f23' }} className="h-75 d-flex justify-content-around align-items-center text-light flex-column">
        <h1 >Backbone</h1>
        <section className="d-flex justify-content-around align-items-center" style={{ width: '90%', height: '20vh' }}>
          <Funcionalidade texto="Produtos" rota={grupo == "adm" ? '/produtos?grupo=adm' : '/produtos'} />
          <Funcionalidade display={display} texto="Usuários" rota={"/pessoas"} />
          <Funcionalidade display={display} texto="Pedidos" />
        </section>
      </div>
      <div style={{ backgroundColor: '#1c1f23' }} className="h-25 d-flex justify-content-around align-items-center text-light flex-column"></div>
    </>
  )
}
export default Backbone;