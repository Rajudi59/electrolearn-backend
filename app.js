const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota de teste
app.get("/", (req, res) => {
    res.send("Backend do ElectroLearn AI funcionando!");
});

// Aqui vão as rotas para processar perguntas e buscar nos arquivos
// Podemos adicionar depois as funções da IA

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
