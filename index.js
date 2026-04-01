const express = require('express');
const cors = require('cors');

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
  res.json({ ok: true, status: 'ok' });
});

// EVA chat
app.post('/api/eva/chat', (req, res) => {
  const { prompt } = req.body || {};
  res.json({
    ok: true,
    reply: 'EVA: I received your request -> ' + (prompt || '')
  });
});

// Agents execute
app.post
