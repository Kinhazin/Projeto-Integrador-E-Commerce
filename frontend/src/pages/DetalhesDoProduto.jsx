import HeaderDefault from "../components/default/HeaderDefault";
import { useLocation } from "react-router-dom";

function DetalhesDoProduto() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const url = queryParams.get("url");
    const preco = queryParams.get("preco");
    const avaliacao = queryParams.get("avaliacao");
    const nome = queryParams.get("nome");
    const descricao = queryParams.get("descricao");
    const id = queryParams.get("id");
    


    function adicionarCarrinho(produto) {
        console.log(produto.id)
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


   const  dados = {
        nome : nome,
        url  : url,
        preco : preco,
        avaliacao : avaliacao,
        descricao : descricao,
        id : id
    }


    return (
        <section style={{ backgroundColor: '#EDEFF2' }} className="h-100 w-100">
            <HeaderDefault />
            <section className="shadow w-100 d-flex justify-content-center" style={{ height: '90%' }}>
                <div className="shadow h-100 w-100 d-flex" style={{ width: '90%' }}>
                    <div className="h-100 w-50 d-flex justify-content-center align-items-center">
                        <div style={{ width: '75%' }} className="h-75 shadow border-1 border-black">
                            <img src={"http://localhost:8080" + url} className="w-100 h-100" alt="" />
                            <div className="w-100 d-flex justify-content-center">
                                <button className="btn text-white w-75 mt-4" style={{backgroundColor: '#34495E'}}
                                onClick={()=>adicionarCarrinho(dados)}
                                >Comprar</button>
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
                            <div className="d-flex flex-row gap-2 pt-2 ">
                                <p className="text-dark fw-bold fs-3">Nota:</p>
                                <p className="fs-3">{avaliacao}</p>
                            </div>
                        </section>

                    </div>
                </div>
            </section>
        </section>
    )
}

export default DetalhesDoProduto;