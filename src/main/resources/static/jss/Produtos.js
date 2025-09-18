const API_URL = "/produtos";

document.addEventListener("DOMContentLoaded", () => {
  carregarTabela();
});

async function carregarTabela() {
  const tbody = document.getElementById("produtos-tbody");
  if (!tbody) return;

  // Estado de "carregando"
  setMensagem(tbody, "Carregando produtos...");

  try {
    const produtos = await buscarProdutos();
    renderizarLinhas(tbody, produtos);
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
        // TODO: implemente a navegação para a tela de edição
        // Exemplo: window.location.href = `/produtos/${id}/editar`;
        console.log("Alterar", id);
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
        async () => {
          // TODO: implemente a chamada de toggle de status na sua API
          // Exemplo (se tiver endpoint):
          // await fetch(`/produtos/${id}/status`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: ativo ? 'INATIVO':'ATIVO' }) });
          console.log(ativo ? "Desativar" : "Ativar", id);
          // Dica: após sucesso, recarregue a tabela:
          // carregarTabela();
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
