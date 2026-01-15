import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Inicializar OpenAI com a chave da variável de ambiente
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Caminho para salvar histórico
const HISTORICO_FILE = "./historico.json";

// Cria arquivo de histórico se não existir
if (!fs.existsSync(HISTORICO_FILE)) {
  fs.writeFileSync(HISTORICO_FILE, JSON.stringify([]));
}

// Rota principal de chat
app.post("/chat", async (req, res) => {
  const question = req.body.question;
  if (!question) return res.json({ answer: "Pergunta vazia!" });

  try {
    // Chamada ao OpenAI GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
    });

    const answer = completion.choices[0].message.content;

    // Salvar pergunta e resposta no histórico
    const historico = JSON.parse(fs.readFileSync(HISTORICO_FILE));
    historico.push({ question, answer, timestamp: new Date().toISOString() });
    fs.writeFileSync(HISTORICO_FILE, JSON.stringify(historico, null, 2));

    // Retornar resposta ao frontend
    res.json({ answer });
  } catch (error) {
    console.error("Erro GPT:", error);
    res.json({ answer: "Erro na IA: " + error.message });
  }
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));

