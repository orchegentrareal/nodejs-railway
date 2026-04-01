const express = require('express');
const cors = require('cors');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'ORCHEGENTRA backend is running',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    live_ai: !!process.env.OPENROUTER_API_KEY
  });
});

// EVA chat (REAL AI)
app.post('/api/eva/chat', async (req, res) => {
  try {
    const { prompt } = req.body || {};

    const response = await fetch(process.env.OPENROUTER_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are EVA, a highly intelligent human-like AI assistant."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      ok: true,
      reply: data.choices?.[0]?.message?.content || "No AI response"
    });

  } catch (error) {
    res.json({
      ok: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
