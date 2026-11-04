require('dotenv/config');
const path = require('path');
const fs = require('fs');
const router = require('./modules/auth/auth.routes.cjs');
const express = require('express');
const cors = require('cors');
const app = express();        // 1º: cria o app
const tratarErros = require('./middlewares/tratar-erros.cjs');
const cookieParser = require('cookie-parser');
const usuarioRoutes = require('./modules/usuarios/usuario.routes.cjs')
const esporteRoutes = require('./modules/esportes/esporte.routes.cjs');
const localRoutes = require('./modules/locais/local.routes.cjs');
const inscricaoRoutes = require('./modules/inscricoes/inscricao.routes.cjs');
const avaliacaoRoutes = require('./modules/avaliacoes/avaliacao.routes.cjs');

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
app.use('/api/inscricoes-esporte', inscricaoRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
const PORT = Number(process.env.PORT) || 3000;

app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'Conexão entre frontend e backend funcionando!' });
});

// Qualquer outro /api/... que não existe responde em JSON, em vez de cair no site
app.use('/api', (req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

// Em produção, o próprio backend entrega o site React compilado (frontend/dist).
// Site e API ficam no mesmo endereço, o que o cookie de sessão (SameSite=Lax) exige.
const PASTA_SITE = path.join(__dirname, '..', 'frontend', 'dist');
const servirSite = process.env.NODE_ENV === 'production' && fs.existsSync(path.join(PASTA_SITE, 'index.html'));

if (servirSite) {
  app.use(express.static(PASTA_SITE));
  // Rotas do React (/home, /esportes/3...) recebem o index.html; quem decide a tela é o React Router
  app.get('/{*caminho}', (req, res) => {
    res.sendFile(path.join(PASTA_SITE, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Backend do Unifor Sports Hub está rodando!');
  });
}

app.use(tratarErros); // 4º: registra o middleware de tratamento de erros


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Acessível na rede local em http://<SEU_IP_LOCAL>:${PORT}`);
});