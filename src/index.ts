import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send(`
    <h1>🚀 Orchegentra AI Backend Running</h1>
    <p>Status: ACTIVE</p>
    <p>Time: ${new Date().toISOString()}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
