const formulario = document.getElementById("formulario_login");
formulario.onsubmit = enviarDados;

async function enviarDados(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  console.log(email);
  console.log(senha);

  const url = `/pessoas/buscar?email=${encodeURIComponent(
    email
  )}&senha=${encodeURIComponent(senha)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Erro ao se conectar com o banco de dados!");
  }
  const data = await response.json();

  if (data.length == 0 || data[0].status == "inativo") {
    alert("Usuário não cadastrado ou inativo!");
    throw new Error("Usuário não autenticado");
  }
  console.log(data[0]);
  switch (data[0].grupo) {
    case "administrativo":
      window.location.href =
        "http://localhost:8080/aplicacao?grupo=administrativo";
      break;

    case "usuario":
      window.location.href = "http://localhost:8080/aplicacao?grupo=usuario";
      break;
  }
}
