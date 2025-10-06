import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Backbone from '../pages/Backbone';
import Pessoas from '../pages/Pessoas';
import Login from '../pages/Login';
import Produtos from '../pages/Produtos';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/backbone" element={<Backbone />} />
                <Route path="/pessoas" element={<Pessoas />} />
                <Route path="/produtos" element={<Produtos />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;