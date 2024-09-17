const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const apiKey = process.env.ANTHROPIC_API_KEY;

console.log('ANTHROPIC_API_KEY:', apiKey ? 'Set' : 'Not set');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, max_tokens } = req.body;
    
    const systemMessage = messages.find(m => m.role === "system")?.content || "";
    const userMessage = messages.find(m => m.role === "user")?.content || "";

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model,
      max_tokens,
      messages: [{ role: "user", content: userMessage }],
      system: systemMessage
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports.handler = serverless(app);