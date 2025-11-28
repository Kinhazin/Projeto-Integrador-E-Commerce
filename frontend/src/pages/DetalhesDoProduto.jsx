import HeaderDefault from "../components/default/HeaderDefault";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Adicionado para garantir o funcionamento do JS do Bootstrap (Carrossel)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function DetalhesDoProduto() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const url = queryParams.get("url");
    const preco = queryParams.get("preco");
    const avaliacao = queryParams.get("avaliacao");
    const nome = queryParams.get("nome");
    const descricao = queryParams.get("descricao");
    const id = queryParams.get("id");

    const [imagens, setImagens] = useState([]);

    function adicionarCarrinho(produto) {
        const itemExistenteString = localStorage.getItem(produto.id);
        let itemParaSalvar;

        if (itemExistenteString) {
            const itemExistente = JSON.parse(itemExistenteString);
            itemExistente.quantidadeCarrinho += 1;
            itemParaSalvar = itemExistente;
            alert(`Mais um ${produto.nome} foi adicionado ao carrinho!`);
        } else {
            itemParaSalvar = { ...produto, quantidadeCarrinho: 1 };
            alert(`${produto.nome} foi adicionado ao carrinho.`);
        }

        localStorage.setItem(String(itemParaSalvar.id), JSON.stringify(itemParaSalvar));
    }

    async function pegarImagens() {
        try {
            const response = await fetch(`http://localhost:8080/api/imagens/${id}`);
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            setImagens(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if(id) pegarImagens();
    }, [id]);

    const dados = {
        nome,
        url,
        preco,
        avaliacao,
        descricao,
        id
    };

    return (
        <section style={{ backgroundColor: '#EDEFF2' }} className="h-100 w-100">
            <HeaderDefault />

            <section className="shadow w-100 d-flex justify-content-center" style={{ height: '90%' }}>
                <div className="shadow h-100 w-100 d-flex" style={{ width: '90%' }}>

                    <div className="h-100 w-50 d-flex justify-content-center align-items-center">
                        <div style={{ width: '75%' }} className="h-75 shadow border-1 border-black">

                            <div id="carouselProduto" className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">

                                    {imagens.length > 0 ? (
                                        imagens.map((img, index) => (
                                            <div
                                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                                                key={img.id || index}
                                            >
                                                <img
                                                    src={`http://localhost:8080${img.url}`}
                                                    className="d-block w-100"
                                                    alt={`Imagem ${index}`}
                                                    style={{ maxHeight: "500px", objectFit: "contain" }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="carousel-item active">
                                            <img
                                                src={`http://localhost:8080${url}`}
                                                className="d-block w-100"
                                                alt="Imagem principal"
                                                style={{ maxHeight: "500px", objectFit: "contain" }}
                                            />
                                        </div>
                                    )}

                                </div>

                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselProduto" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" style={{ filter: 'invert(100%)' }}></span>
                                    <span className="visually-hidden">Anterior</span>
                                </button>

                                <button className="carousel-control-next" type="button" data-bs-target="#carouselProduto" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" style={{ filter: 'invert(100%)' }}></span>
                                    <span className="visually-hidden">Próximo</span>
                                </button>
                            </div>


                            <div className="w-100 d-flex justify-content-center">
                                <button
                                    className="btn text-white w-75 mt-4"
                                    style={{ backgroundColor: '#34495E' }}
                                    onClick={() => adicionarCarrinho(dados)}
                                >
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-100 w-50 d-flex align-items-center">
                        <section className="text-dark">
                            <div className="d-flex flex-row gap-2">
                                <p className="text-dark fw-bold fs-3">Nome do produto:</p>
                                <p className="fs-3">{nome}</p>
                            </div>

                            <div className="d-flex flex-column">
                                <p className="text-dark fw-bold m-0 fs-3">Descrição:</p>
                                <p className="fs-3">{descricao}</p>
                            </div>

                            <div className="d-flex flex-row gap-2">
                                <p className="text-dark fw-bold fs-3">Preço:</p>
                                <p className="fs-3">R$ {preco}</p>
                            </div>

                            <div className="d-flex flex-row gap-2 pt-2">
                                <p className="text-dark fw-bold fs-3">Nota:</p>
                                <p className="fs-3">{avaliacao}</p>
                            </div>
                        </section>
                    </div>

                </div>
            </section>
        </section>
    );
}

export default DetalhesDoProduto;