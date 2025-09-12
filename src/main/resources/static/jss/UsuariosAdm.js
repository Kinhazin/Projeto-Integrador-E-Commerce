window.onload = async function () {
  const response = await fetch("/pessoas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao se conectar com o banco de dados!");
  }
  const dados = await response.json();
  console.log(dados);
};
