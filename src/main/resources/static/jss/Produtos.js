let paginaAtual = 1;
const itensPorPagina = 10;
let todosProdutos = [];
let termoBusca = "";
let produtoIdRecemCriado = null;
let produtoIdEmEdicao = null;

const API_URL = "/produtos";

document.addEventListener("DOMContentLoaded", () => {
  carregarTabela();
});

async function carregarTabela() {
  const tbody = document.getElementById("produtos-tbody");
  if (!tbody) return;

  setMensagem(tbody, "Carregando produtos...");

  try {
    todosProdutos = await buscarProdutos();
    renderizarPagina();
  } catch (err) {
    console.error(err);
    setMensagem(
      tbody,
      "Não foi possível carregar os produtos. Tente mais tarde.",
      true
    );
  }
}

/** Faz a requisição GET para /produtos e retorna um array de Produto */
async function buscarProdutos() {
  const resp = await fetch(API_URL, {
    headers: { Accept: "application/json" },
  });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(`Erro ${resp.status}: ${txt || resp.statusText}`);
  }
  const data = await resp.json();

  if (!Array.isArray(data)) {
    throw new Error("A resposta da API não é um array de produtos.");
  }

  // Cada item esperado com: id, nome, quantidadeEstoque, preco, status
  return data;
}

/** Renderiza as linhas da tabela */
function renderizarLinhas(tbody, produtos) {
  tbody.innerHTML = "";

  if (!produtos || produtos.length === 0) {
    setMensagem(tbody, "Nenhum produto encontrado.");
    return;
  }

  const frag = document.createDocumentFragment();

  for (const p of produtos) {
    const tr = document.createElement("tr");

    const id = p.id ?? "";
    const nome = p.nome ?? "";
    const qtd = p.quantidadeEstoque ?? 0;
    const preco = p.preco ?? null;
    const status = (p.status || "").toUpperCase();

    // Código
    tr.appendChild(tdText(id, true));

    // Nome
    tr.appendChild(tdText(nome));

    // Quantidade
    tr.appendChild(tdText(qtd));

    // Valor (R$)
    tr.appendChild(tdText(formatBRL(preco)));

    // Status (badge)
    tr.appendChild(tdStatus(status));

    // Opções: Alterar

    tr.appendChild(
      tdAcao("Alterar", "btn-outline-primary", () => {
        abrirModalEdicao(id); // ✅ abre a modal com os dados do produto
      })
    );

    // Opções: Visualizar
    tr.appendChild(
      tdAcao("Visualizar", "btn-outline-secondary", () => {
        // TODO: implemente a navegação para a tela de detalhes
        // Exemplo: window.location.href = `/produtos/${id}`;
        console.log("Visualizar", id);
      })
    );

    // Opções: Ativar/Desativar
    const ativo = status === "ATIVO";

    tr.appendChild(
      tdAcao(
        ativo ? "Desativar" : "Ativar",
        ativo ? "btn-outline-danger" : "btn-outline-success",
        () => {
          toggleStatusProduto(id, status);
        }
      )
    );

    frag.appendChild(tr);
  }

  tbody.appendChild(frag);
}

/* ============================
 * Helpers
 * ============================ */

function tdText(texto, mono = false) {
  const td = document.createElement("td");
  td.className = "text-center";
  const span = document.createElement("span");
  if (mono) span.style.fontFamily = "ui-monospace, Menlo, Consolas, monospace";
  span.textContent = texto ?? "";
  td.appendChild(span);
  return td;
}

function tdStatus(status) {
  const td = document.createElement("td");
  td.className = "text-center";

  const span = document.createElement("span");
  const st = (status || "").toUpperCase();

  const classPorStatus = {
    ATIVO: "badge bg-success",
    INATIVO: "badge bg-secondary",
    ESGOTADO: "badge bg-warning text-dark",
  };

  span.className = classPorStatus[st] || "badge bg-light text-dark";
  span.textContent = st || "—";
  td.appendChild(span);

  return td;
}

function tdAcao(texto, btnClass, onClick) {
  const td = document.createElement("td");
  td.className = "text-center";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `btn btn-sm ${btnClass}`;
  btn.textContent = texto;
  btn.addEventListener("click", onClick);
  td.appendChild(btn);
  return td;
}

function setMensagem(tbody, mensagem, erro = false) {
  tbody.innerHTML = "";
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 8; // 8 colunas de dados (sem a coluna do ícone "+")
  td.className = `text-center ${erro ? "text-danger" : "text-muted"}`;
  td.textContent = mensagem;
  tr.appendChild(td);
  tbody.appendChild(tr);
}

function formatBRL(valor) {
  const n = toNumber(valor);
  if (Number.isFinite(n)) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);
  }
  return "—";
}

function toNumber(v) {
  if (v == null) return null;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    // aceita "1.234,56" ou "1234.56"
    const s = v
      .replace(/\s/g, "")
      .replace(/[R$\u00A0]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function renderizarPaginacao() {
  const paginacao = document.getElementById("paginacao");
  const pageInfo = document.getElementById("page-info");
  paginacao.innerHTML = "";

  const totalPaginas = Math.ceil(todosProdutos.length / itensPorPagina);

  pageInfo.textContent = `Página ${paginaAtual} de ${totalPaginas}`;

  const criarBotao = (texto, habilitado, onClick) => {
    const btn = document.createElement("button");
    btn.className =
      "btn btn-sm mx-1 " + (habilitado ? "btn-primary" : "btn-secondary");
    btn.textContent = texto;
    btn.disabled = !habilitado;
    btn.addEventListener("click", onClick);
    return btn;
  };

  paginacao.appendChild(
    criarBotao("Anterior", paginaAtual > 1, () => {
      paginaAtual--;
      renderizarPagina();
    })
  );

  paginacao.appendChild(
    criarBotao("Próxima", paginaAtual < totalPaginas, () => {
      paginaAtual++;
      renderizarPagina();
    })
  );
}

function renderizarPagina() {
  const tbody = document.getElementById("produtos-tbody");
  tbody.innerHTML = "";

  // Aplica filtro por nome
  const produtosFiltrados = todosProdutos.filter((p) =>
    p.nome?.toLowerCase().includes(termoBusca)
  );

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosPagina = produtosFiltrados.slice(inicio, fim);

  if (produtosPagina.length === 0) {
    setMensagem(tbody, "Nenhum produto encontrado.");
    return;
  }

  renderizarLinhas(tbody, produtosPagina);
  renderizarPaginacao(produtosFiltrados.length);
}

document.addEventListener("DOMContentLoaded", () => {
  carregarTabela();

  const campoBusca = document.getElementById("campo-busca");
  if (campoBusca) {
    campoBusca.addEventListener("input", (e) => {
      termoBusca = e.target.value.toLowerCase();
      paginaAtual = 1; // Reinicia na primeira página
      renderizarPagina();
    });
  }
});

document
  .getElementById("form-cadastro-produto")
  .addEventListener("submit", async (e) => {
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
        throw new Error("Erro ao cadastrar produto.");
      }

      const produto = await resp.json();
      produtoIdRecemCriado = produto.id; // ✅ salva o ID

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("exampleModalCenter")
      );
      modal.hide();
      carregarTabela();
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar produto. Verifique os dados e tente novamente.");
    }
  });

async function carregarGaleria(produtoId) {
  const container = document.getElementById("galeria-imagens");
  container.innerHTML = "Carregando imagens...";

  try {
    const resp = await fetch(`/produtos/${produtoId}/imagens`);
    const imagens = await resp.json();

    if (!Array.isArray(imagens) || imagens.length === 0) {
      container.innerHTML =
        "<p class='text-muted'>Nenhuma imagem associada.</p>";
      return;
    }

    container.innerHTML = "";
    imagens.forEach((img) => {
      const col = document.createElement("div");
      col.className = "col-md-3 text-center";

      col.innerHTML = `
        ${img.url}
        <div>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="definirPrincipal(${
            img.id
          }, ${produtoId})">
            ${img.principal ? "Principal ✅" : "Definir como Principal"}
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="removerImagem(${
            img.id
          }, ${produtoId})">
            Excluir
          </button>
        </div>
      `;
      container.appendChild(col);
    });
  } catch (err) {
    container.innerHTML =
      "<p class='text-danger'>Erro ao carregar imagens.</p>";
    console.error(err);
  }
}

async function definirPrincipal(imagemId, produtoId) {
  try {
    const produto = await fetch(`/produtos/${produtoId}`).then((r) => r.json());
    const imagens = produto.imagens.map((img) => {
      img.principal = img.id === imagemId;
      return img;
    });

    await fetch(`/produtos/${produtoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...produto, imagens }),
    });

    carregarGaleria(produtoId);
  } catch (err) {
    alert("Erro ao definir imagem principal.");
    console.error(err);
  }
}

async function removerImagem(imagemId, produtoId) {
  try {
    await fetch(`/produtos/${produtoId}/imagens/${imagemId}`, {
      method: "DELETE",
    });
    carregarGaleria(produtoId);
  } catch (err) {
    alert("Erro ao remover imagem.");
    console.error(err);
  }
}

async function abrirModalEdicao(produtoId) {
  try {
    const resp = await fetch(`/produtos/${produtoId}`);
    if (!resp.ok) throw new Error("Produto não encontrado");

    const produto = await resp.json();

    // Preenche os campos
    document.getElementById("editar-id").value = produto.id;
    document.getElementById("editar-nome").value = produto.nome;
    document.getElementById("editar-avaliacao").value = produto.avaliacao;
    document.getElementById("editar-descricao").value = produto.descricao;
    document.getElementById("editar-preco").value = produto.preco;
    document.getElementById("editar-estoque").value = produto.quantidadeEstoque;
    document.getElementById("editar-status").value = produto.status;

    // Carrega galeria
    carregarGaleriaEdicao(produto.id);

    // Abre modal
    const modal = new bootstrap.Modal(
      document.getElementById("modalEditarProduto")
    );
    modal.show();
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar produto para edição.");
  }
}

async function carregarGaleriaEdicao(produtoId) {
  const container = document.getElementById("galeria-edicao");
  container.innerHTML = "<p class='text-muted'>Carregando imagens...</p>";

  try {
    const resp = await fetch(`/produtos/${produtoId}/imagens`);
    const imagens = await resp.json();

    if (!Array.isArray(imagens) || imagens.length === 0) {
      container.innerHTML =
        "<p class='text-muted'>Nenhuma imagem associada.</p>";
      return;
    }

    container.innerHTML = "";
    imagens.forEach((img) => {
      const col = document.createElement("div");
      col.className = "col-md-3 text-center mb-3";

      col.innerHTML = `
  <img style="height: 200px;" src="${img.url}"  
    <button class="btn btn-sm btn-outline-primary me-1" onclick="definirPrincipal(${
      img.id
    }, ${produtoId})">
      ${img.principal ? "Principal ✅" : "Definir como Principal"}
    </button>

    <button class="btn btn-sm btn-outline-danger" onclick="removerImagem(${
      img.id
    }, ${produtoId})">
      Excluir
    </button>
  </div>
`;

      container.appendChild(col);
    });
  } catch (err) {
    container.innerHTML =
      "<p class='text-danger'>Erro ao carregar imagens.</p>";
    console.error(err);
  }
}

document
  .getElementById("form-editar-produto")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editar-id").value;
    const nome = document.getElementById("editar-nome").value.trim();
    const avaliacao = parseFloat(
      document.getElementById("editar-avaliacao").value
    );
    const descricao = document.getElementById("editar-descricao").value.trim();
    const preco = parseFloat(document.getElementById("editar-preco").value);
    const estoque = parseInt(document.getElementById("editar-estoque").value);
    const status = document.getElementById("editar-status").value;
    const novasImagens = document.getElementById("editar-imagens").files;

    try {
      // Atualiza dados do produto
      await fetch(`/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          avaliacao,
          descricao,
          preco,
          quantidadeEstoque: estoque,
          status,
        }),
      });

      // Envia novas imagens (se houver)
      if (novasImagens.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < novasImagens.length; i++) {
          formData.append("imagens", novasImagens[i]);
        }

        await fetch(`/produtos/com-imagens/${id}/adicionar`, {
          method: "POST",
          body: formData,
        });
      }

      alert("Produto atualizado com sucesso!");
      bootstrap.Modal.getInstance(
        document.getElementById("modalEditarProduto")
      ).hide();
      carregarTabela();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações.");
    }
  });

async function definirPrincipal(imagemId, produtoId) {
  try {
    const produto = await fetch(`/produtos/${produtoId}`).then((r) => r.json());
    const imagens = produto.imagens.map((img) => {
      img.principal = img.id === imagemId;
      return img;
    });

    await fetch(`/produtos/${produtoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...produto, imagens }),
    });

    carregarGaleriaEdicao(produtoId);
  } catch (err) {
    alert("Erro ao definir imagem principal.");
    console.error(err);
  }
}

async function removerImagem(imagemId, produtoId) {
  try {
    await fetch(`/produtos/${produtoId}/imagens/${imagemId}`, {
      method: "DELETE",
    });
    carregarGaleriaEdicao(produtoId);
  } catch (err) {
    alert("Erro ao remover imagem.");
    console.error(err);
  }
}

async function toggleStatusProduto(id, statusAtual) {
  const novoStatus = statusAtual === "ATIVO" ? "INATIVO" : "ATIVO";
  if (confirm("Deseja confirmar a alteração? ")) {
    try {
      const resp = await fetch(`/produtos/${id}/status?status=${novoStatus}`, {
        method: "PATCH",
      });

      if (!resp.ok) {
        throw new Error("Erro ao atualizar status.");
      }

      carregarTabela(); // Recarrega a tabela após sucesso
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar status do produto.");
    }
  }else{
    alert("Operação cancelada")
  }
}
