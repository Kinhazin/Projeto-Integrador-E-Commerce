import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Pessoas from '../pages/Pessoas';
import Backbone from '../pages/Backbone';
import Produtos from '../pages/Produtos';
import HomePage from '../pages/HomePage';
import Carrinho from '../pages/Carrinho';
import DetalhesDoProduto from '../pages/DetalhesDoProduto';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/backbone" element={<Backbone />} />
                <Route path="/pessoas" element={<Pessoas />} />
                <Route path="/produtos" element={<Produtos />}/>
                <Route path="/home" element={<HomePage />}/>
                <Route path="/detalhes" element={<DetalhesDoProduto />}/>
                <Route path="/carrinho" element={<Carrinho />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;