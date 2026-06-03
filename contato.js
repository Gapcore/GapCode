document
  .getElementById("contatoForm")
  .addEventListener("submit", function (e) {

    e.preventDefault();

    const lead = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      mensagem: document.getElementById("mensagem").value
    };

    document
  .getElementById("contatoForm")
  .addEventListener("submit", async function (e) {

    e.preventDefault();

    const lead = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      mensagem: document.getElementById("mensagem").value
    };

    const resposta = await fetch("http://localhost:3000/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(lead)
    });

    const dados = await resposta.json();

    alert(dados.mensagem);
});
});