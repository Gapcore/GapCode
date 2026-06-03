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

    console.log("Enviando lead:", lead);

    try {

      const resposta = await fetch("http://localhost:3000/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(lead)
      });

      console.log("Status:", resposta.status);

      const dados = await resposta.json();

      console.log("Resposta:", dados);

      alert(dados.mensagem);

    } catch (erro) {

      console.error("ERRO FETCH:", erro);

    }

});