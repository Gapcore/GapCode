const supabaseUrl = "https://ddfvcqgzcrbchjicchty.supabase.co";

const supabaseKey =
"sb_publishable_XPWIazDX5IDMjKOcYbNtvg_-KCI0bH3";

const supabaseClient = supabase.createClient(
    supabaseUrl,
    supabaseKey
);

document
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

document.querySelector(".titulo").style.display = "none";

    botao.disabled = false;
    botao.innerText = "Enviar Contato";
});