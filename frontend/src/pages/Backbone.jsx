import Funcionalidade from "../components/backbone/Funcionalidade";
import { useLocation } from "react-router-dom";

function Backbone() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const grupo = queryParams.get('grupo');
  const display = grupo === 'adm' ? 'block' : 'none';

  return (
    <>
      <div style={{ backgroundColor: '#EDEFF2', minHeight: '100%', minWidth: '100%' }} className="h-75 d-flex justify-content-around align-items-center text-light flex-column">
        <section className="d-flex justify-content-around align-items-center" style={{ width: '90%', height: '20vh' }}>
          <Funcionalidade texto="Produtos" rota={grupo == "adm" ? '/produtos?grupo=adm' : '/produtos'} />
          <Funcionalidade display={display} texto="Usuários" rota={"/pessoas"} />
          <Funcionalidade display={display} texto="Pedidos" />
        </section>
      </div>

    </>
  )
}
export default Backbone;