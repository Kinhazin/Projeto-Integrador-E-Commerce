let dados = [];
let idClicado = null;

async function atualizarDadosDaTela() {
  try {
    const response = await fetch("/pessoas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao se conectar com o banco de dados!");
    }

    dados = await response.json();
    console.log(dados);
    renderizarTabela(dados);
  } catch (error) {
    console.error(error.message);
  }
}

function renderizarTabela(dados) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  dados.forEach((p) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="text-center">${p.id}</td>
      <td class="text-center">${p.nome}</td>
      <td class="text-center">${p.email}</td>
      <td class="text-center">${p.status}</td>
      <td class="text-center">${p.grupo}</td>
      <td class="botaoEditar text-center" id="${
        p.id
      }" data-bs-toggle="modal" data-bs-target="#editarUsuario">Editar</td>
      <td class="text-center" colspan="2">${
        p.status == "ativo" ? "inativar" : "ativar"
      }</td>
    `;

    tbody.appendChild(tr);
  });

  // Reatribui os eventos após renderizar
  const botoesEditar = document.querySelectorAll(".botaoEditar");
  botoesEditar.forEach(function (td) {
    td.addEventListener("click", function () {
      idClicado = this.id;
      const usuario = dados.find((p) => p.id == `${idClicado}`);
      console.log(usuario);

      document.getElementById("cpfEdit").value = usuario.cpf;
      document.getElementById("nomeEdit").value = usuario.nome;
      document.getElementById("senhaEdit").value = usuario.senha;
      document.getElementById("confirmaSenhaEdit").value = usuario.senha;
    });
  });
}

const enviarEditar = document.getElementById("enviarEditar");

async function atualizarDados(event) {
  event.preventDefault();
  const usuario = dados.find((p) => p.id == `${idClicado}`);

  const nome = document.getElementById("nomeEdit").value;
  const cpf = document.getElementById("cpfEdit").value;
  const email = usuario.email;
  const senha = document.getElementById("senhaEdit").value;
  const confirmaSenha = document.getElementById("confirmaSenhaEdit").value;
  const grupo = document.getElementById("grupoEdit").value;

  try {
    // Validação de senhas diferentes
    if (senha !== confirmaSenha) {
      throw new Error("As senhas não coincidem");
    }

    // Validação de CPF
    if (!validarCPF(cpf)) {
      throw new Error("CPF inválido");
    }

    const response = await fetch(`/pessoas/${idClicado}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        cpf,
        email,
        senha,
        grupo,
        status: "ativo",
      }),
    });

    if (response.ok) {
      alert("Usuário editado com sucesso");
      await atualizarDadosDaTela(); // Atualiza a tabela após cadastro
      document.getElementById("cadastrar-usuario").reset(); // Limpa o formulário
    } else {
      alert("Erro ao cadastrar usuário");
    }
  } catch (erro) {
    alert(erro.message);
  }
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

async function enviarDados(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmaSenha = document.getElementById("confirmaSenha").value;
  const grupo = document.getElementById("grupo").value;

  try {
    // Validação de e-mail duplicado
    const emailExistente = dados.some((element) => element.email === email);
    if (emailExistente) {
      throw new Error("E-mail já cadastrado");
    }

    // Validação de senhas diferentes
    if (senha !== confirmaSenha) {
      throw new Error("As senhas não coincidem");
    }

    // Validação de CPF
    if (!validarCPF(cpf)) {
      throw new Error("CPF inválido");
    }

    const response = await fetch("/pessoas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        cpf,
        email,
        senha,
        grupo,
        status: "ativo",
      }),
    });

    if (response.ok) {
      alert("Usuário cadastrado com sucesso");
      await atualizarDadosDaTela(); // Atualiza a tabela após cadastro
      document.getElementById("cadastrar-usuario").reset(); // Limpa o formulário
    } else {
      alert("Erro ao cadastrar usuário");
    }
  } catch (erro) {
    alert(erro.message);
  }
}

window.onload = function () {
  atualizarDadosDaTela();
  document.getElementById("cadastra").onsubmit = enviarDados;
  document.getElementById("editaUsuarios").onsubmit = atualizarDados;
};
