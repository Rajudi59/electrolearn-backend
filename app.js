// app.js - ElectroLearn Teste OpenAI GPT

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Coloque sua chave da OpenAI aqui
const openai = new OpenAI({
  apiKey: "chave
" 
});

app.use(cors());
app.use(bodyParser.json());

// Rota para receber pergunta do front-end
app.post("/chat", async (req, res) => {
  const { question } = req.body;

  if (!question) return res.status(400).json({ answer: "Pergunta vazia!" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente técnico de elétrica." },
        { role: "user", content: question }
      ],
      max_tokens: 500
    });

    const answer = response.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error("Erro OpenAI:", error);
    res.status(500).json({ answer: "Erro ao consultar a IA." });
  }
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("Back-end ElectroLearn rodando!");
});

app.listen(port, () => {
  console.log(`Back-end rodando em http://localhost:${port}`);
});



