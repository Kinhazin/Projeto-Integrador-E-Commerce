window.onload = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const grupo = urlParams.get('grupo')?.trim();

  const usuarios = document.getElementById("usuarios");
  const pedidos = document.getElementById("pedidos");
  const produtos = document.getElementById("produtos");

  console.log(grupo);

  if (grupo === "usuario") {
    usuarios.removeAttribute('class');
    pedidos.removeAttribute('class');
    usuarios.style.display = "none";
    pedidos.style.display = "none";
  }

  usuarios.addEventListener('click', () => {
    window.location.href = "http://localhost:8080/pessoashtml";
  });

  if(grupo == "administrativo"){
    produtos.addEventListener('click', () => {
    window.location.href = "http://localhost:8080/products";
  });
  }else{
    produtos.addEventListener('click', () => {
    window.location.href = "http://localhost:8080/products?grupo=usuario";
    })
}

  document.getElementById("form-cadastro-produto").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const avaliacao = parseFloat(document.getElementById("avaliacao").value);
    const descricao = document.getElementById("descricao").value.trim();
    const preco = parseFloat(document.getElementById("preco").value);
    const estoque = parseInt(document.getElementById("estoque").value);
    const imagens = document.getElementById("imagens").files;

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("avaliacao", avaliacao);
    formData.append("descricao", descricao);
    formData.append("preco", preco);
    formData.append("quantidadeEstoque", estoque);

    for (let i = 0; i < imagens.length; i++) {
      formData.append("imagens", imagens[i]);
    }

    try {
      const resp = await fetch("/produtos/com-imagens", {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const erro = await resp.text();
        throw new Error(`Erro ao cadastrar produto: ${erro}`);
      }

      const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModalCenter"));
      modal.hide();

      e.target.reset();
      carregarTabela();
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar produto. Verifique os dados e tente novamente.");
    }
  });
};
