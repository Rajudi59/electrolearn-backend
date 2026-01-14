import express from "express";
import fs from "fs";
import fetch from "node-fetch"; // se não estiver instalado, adicionar no package.json
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota principal do chat
app.post("/chat", async (req, res) => {
  const input = req.body.question;
  if (!input) return res.status(400).json({ error: "Pergunta vazia" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é especialista em elétrica e ajuda com diagnósticos e consertos." },
          { role: "user", content: input }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const answer = data.choices[0].message.content;

    saveInteraction(input, answer);

    res.json({ answer });

  } catch (error) {
    console.error("Erro GPT:", error);
    res.status(500).json({ error: error.message });
  }
});

// Função para salvar histórico
function saveInteraction(pergunta, resposta) {
  const path = "./interactions.json";
  let data = [];

  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }

  data.push({
    pergunta,
    resposta,
    data: new Date().toISOString()
  });

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// Inicializar backend
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
