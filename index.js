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

  app.post('/api/eva/chat', (req, res) => {
  const { prompt } = req.body || {};

  res.json({
    ok: true,
    reply: "EVA working: " + (prompt || "no input")
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
