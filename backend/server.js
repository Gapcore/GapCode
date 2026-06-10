console.log("=== ESTE É O SERVER.JS CORRETO ===");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// Configurações
app.use(cors());
app.use(express.json());

// Conexão com o Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Rota para receber leads
app.post("/leads", async (req, res) => {

    console.log("REQUISIÇÃO RECEBIDA");
    console.log(req.body);

    const { nome, email, telefone, mensagem } = req.body;

    const { data, error } = await supabase
        .from("leads")
        .insert([
            {
                nome,
                email,
                telefone,
                mensagem
            }
        ]);

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao salvar lead"
        });
    }

    return res.status(200).json({
        sucesso: true,
        mensagem: "Lead salvo com sucesso!"
    });
});

// Teste do servidor
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

// Inicialização
app.listen(3000, () => {
    console.log("Servidor rodando em https://gapcore.setupx.pro/contato.html");
});