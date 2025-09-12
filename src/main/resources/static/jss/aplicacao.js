const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const grupo = urlParams.get('grupo').trim(); 
const usuarios = document.getElementById("usuarios");
const pedidos = document.getElementById("pedidos");

window.onload = function () {


  console.log(grupo)

  if (grupo == "usuario") {
    usuarios.removeAttribute('class');
    pedidos.removeAttribute('class')
    usuarios.style.display = "none";
    pedidos.style.display = "none";
  }

};

usuarios.addEventListener('click', ()=>{
  window.location.href = "http://localhost:8080/pessoashtml";
})