const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// TEST
app.get('/health', (req, res) => {
  res.json({ ok: true, status: 'ok' });
});

// EVA CHAT
app.post('/api/eva/chat', (req, res) => {
  const { prompt } = req.body || {};
  res.json({
    ok: true,
    reply: 'EVA working: ' + (prompt || 'no input')
  });
});

// ROOT
app.get('/', (req, res) => {
  res.send('ORCHEGENTRA BACKEND RUNNING');
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
