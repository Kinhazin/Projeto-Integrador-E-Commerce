import { Store, User, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";


function HeaderDefault() {
    const navigate = useNavigate()
    return <header className="shadow d-flex align-items-center justify-content-between px-4" style={{ backgroundColor: '#34495E', height: '80px' }}>
        <Store onClick={()=> navigate("/home")}  width={40} color="white" height={40} className="suave-transition" />
        <div className="d-flex flex-row justify-content-center align-items-center gap-4">
            <div className="suave-transition d-flex flex-row justify-content-center align-items-center ms-2 gap-1" style={{ color: 'white' }}>
                <ShoppingCart onClick={()=> navigate("/carrinho")} width={40} color="white" height={40} />
            </div>
            <div className="d-flex flex-row justify-content-center align-items-center ms-2 gap-1" style={{ color: 'white' }}>
                <p className="text-center h-100 m-0"><b>Faça login</b> <br />ou <b>cadastre-se</b></p>
                <User className="suave-transition" width={40} color="white" height={40} />
            </div>
        </div>
    </header>
}

export default HeaderDefault;