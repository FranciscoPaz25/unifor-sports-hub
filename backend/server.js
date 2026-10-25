require('dotenv/config');
const router = require('./modules/auth/auth.routes.cjs');
const express = require('express');
const cors = require('cors');
const app = express();        // 1º: cria o app
const tratarErros = require('./middlewares/tratar-erros.cjs');
const cookieParser = require('cookie-parser');
const usuarioRoutes = require('./modules/usuarios/usuario.routes.cjs')
const esporteRoutes = require('./modules/esportes/esporte.routes.cjs');
const localRoutes = require('./modules/locais/local.routes.cjs');

// Origens do frontend liberadas no CORS, separadas por vírgula no .env
const origensPermitidas = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origem) => origem.trim())
  .filter(Boolean);

app.use(cors({
  origin: origensPermitidas,
  credentials: true,
}));              // 2º: só agora pode usar
app.use(express.json());    
app.use(cookieParser())
app.use('/api/auth', router); // 3º: registra o router
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/esportes', esporteRoutes);
app.use('/api/locais', localRoutes);
const PORT = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
  res.send('Backend do Unifor Sports Hub está rodando!');
});

app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'Conexão entre frontend e backend funcionando!' });
});

app.use(tratarErros); // 4º: registra o middleware de tratamento de erros


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Acessível na rede local em http://<SEU_IP_LOCAL>:${PORT}`);
});