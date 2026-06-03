const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/leads", (req, res) => {

    console.log("Novo lead recebido:");
    console.log(req.body);

    res.status(200).json({
        sucesso: true,
        mensagem: "Lead recebido com sucesso!"
    });

});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});