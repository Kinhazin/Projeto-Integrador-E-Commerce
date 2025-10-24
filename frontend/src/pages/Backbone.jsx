import Funcionalidade from "../components/backbone/Funcionalidade";
import { useLocation } from "react-router-dom";


function Backbone() {
  const location = useLocation();
  const {grupo} = location.state;
  console.log(grupo)

  return (
    <>
      <div style={{ backgroundColor: '#EDEFF2', minHeight: '100%', minWidth: '100%' }} className="h-75 d-flex justify-content-around align-items-center text-light flex-column">
        <section className="d-flex justify-content-around align-items-center" style={{ width: '90%', height: '20vh' }}>
          <Funcionalidade texto="Produtos" rota={'/produtos'} grupo={grupo} />
          <Funcionalidade grupo={grupo} display={grupo == 'administrativo' ? 'block' : 'none'} texto="Usuários" rota={"/pessoas"} />
          <Funcionalidade grupo={grupo} display={grupo == 'estoquista' ? 'block' : 'none'} texto="Pedidos" />
        </section>
      </div>

    </>
  )
}
export default Backbone;