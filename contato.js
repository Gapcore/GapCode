const supabaseUrl = "https://ddfvcqgzcrbchjicchty.supabase.co";

const supabaseKey =
"sb_publishable_XPWIazDX5IDMjKOcYbNtvg_-KCI0bH3";

const supabaseClient = supabase.createClient(
    supabaseUrl,
    supabaseKey
);

document
<<<<<<< HEAD
  .getElementById("contatoForm")
  .addEventListener("submit", async function (e) {
=======
.getElementById("contatoForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const botao = document.querySelector("button");

    botao.disabled = true;
    botao.innerText = "Enviando...";

    const lead = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        mensagem: document.getElementById("mensagem").value
    };

    const { error } = await supabaseClient
        .from("leads")
        .insert([lead]);

    if(error){

        console.error(error);

        alert("Erro ao enviar contato.");

        botao.disabled = false;
        botao.innerText = "Enviar Contato";

        return;
    }

  document
.getElementById("successCard")
.classList.add("show");

    document.getElementById("contatoForm").reset();

    document
.getElementById("contatoForm")
.style.display = "none";
>>>>>>> 6e97521fa53d503df5b7bc6cea7af3b980a6af90

document.querySelector(".titulo").style.display = "none";

<<<<<<< HEAD
    const lead = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      mensagem: document.getElementById("mensagem").value
    };

    console.log("Enviando lead:", lead);

    try {

      const resposta = await fetch("https://gapcore.setupx.pro/contato.html/leads", {
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

=======
    botao.disabled = false;
    botao.innerText = "Enviar Contato";
>>>>>>> 6e97521fa53d503df5b7bc6cea7af3b980a6af90
});