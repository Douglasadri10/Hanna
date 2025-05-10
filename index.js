const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post('/webhook', async (req, res) => {
  const message = req.body.message;
  const language = detectLanguage(message);

  try {
    const gptResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é Hanna, uma atendente simpática, direta e boa de vendas da M&D Solutions. Atenda em português, inglês ou espanhol com base na mensagem do usuário." },
        { role: "user", content: message }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = gptResponse.data.choices[0].message.content;
    console.log("Resposta da IA:", reply);
    return res.json({ reply });
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error.message);
    return res.status(500).json({ error: 'Erro interno ao processar a mensagem.' });
  }
});

function detectLanguage(text) {
  const lower = text.toLowerCase();
  if (lower.includes("hola") || lower.includes("buenos")) return "es";
  if (lower.includes("hello") || lower.includes("hi")) return "en";
  return "pt";
}

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));