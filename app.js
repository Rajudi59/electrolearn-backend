// app.js - ElectroLearn Teste OpenAI GPT

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Coloque sua chave da OpenAI aqui
const openai = new OpenAI({
  apiKey: "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
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


