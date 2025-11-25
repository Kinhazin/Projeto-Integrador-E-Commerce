import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Pessoas from '../pages/Pessoas';
import Backbone from '../pages/Backbone';
import Produtos from '../pages/Produtos';
import HomePage from '../pages/HomePage';
import Carrinho from '../pages/Carrinho';
import DetalhesDoProduto from '../pages/DetalhesDoProduto';
import HomePageLogado from '../pages/HomePageLogado';
import Checkout from '../pages/Checkout';
import Pedidos from '../pages/Pedidos';
import ResumoPedido from '../pages/ResumoPedido';
import DetalhesDoPedido from '../pages/DetalhesDoPedido';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/backbone" element={<Backbone />} />
                <Route path="/pessoas" element={<Pessoas />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/homepagelogado" element={<HomePageLogado />} />
                <Route path="/detalhes" element={<DetalhesDoProduto />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/resumo-pedido" element={<ResumoPedido />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/detalhes-pedido" element={<DetalhesDoPedido />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;