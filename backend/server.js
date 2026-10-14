const express = require('express');
const cors = require('cors');
const app = express();        // 1º: cria o app
app.use(cors());              // 2º: só agora pode usar

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Backend do Unifor Sports Hub está rodando!');
});

app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'Conexão entre frontend e backend funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});