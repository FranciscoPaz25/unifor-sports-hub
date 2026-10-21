import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Home from './pages/Home/Home';
import Esportes from './pages/Esportes/Esportes';
import DetalhesEsporte from './pages/DetalhesEsporte/DetalhesEsporte';
import MinhasInscricoes from './pages/MinhasInscricoes/MinhasInscricoes';
import Configuracoes from './pages/Configuracoes/Configuracoes';
import Gerencia from './pages/Gerencia/Gerencia';
import CriarEsporte from './pages/CriarEsporte/CriarEsporte';
import GerenciarInscricoes from './pages/GerenciarInscricoes/GerenciarInscricoes';
import RotaProtegida from './components/RotaProtegida/RotaProtegida';

// Placeholder pra rotas que o Navbar já referencia mas que ainda não foram
// construídas nesta fase do MVP (ex.: Eventos, Home admin). Evita tela
// totalmente em branco quando alguém clica num link ainda não implementado.
function EmConstrucao() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>
      <h1 style={{ color: '#003DA5' }}>Em construção</h1>
      <p>Essa tela ainda não foi implementada nesta versão do MVP.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<RotaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/esportes" element={<Esportes />} />
          <Route path="/esportes/:id" element={<DetalhesEsporte />} />
          <Route path="/minhas-inscricoes" element={<MinhasInscricoes />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/eventos" element={<EmConstrucao />} />
        </Route>

        <Route path="/admin" element={<Layout />}>
          <Route path="home" element={<EmConstrucao />} />
          <Route path="eventos" element={<EmConstrucao />} />
          <Route path="gerencia" element={<Gerencia />} />
          <Route path="gerencia/criar-esporte" element={<CriarEsporte />} />
          <Route path="gerencia/inscricoes" element={<GerenciarInscricoes />} />
          <Route path="gerencia/resenhas" element={<EmConstrucao />} />
          <Route path="gerencia/criar-evento" element={<EmConstrucao />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Route>
      {/* qualquer URL fora das rotas acima, ao invés de tela em branco */}
      <Route path="*" element={<EmConstrucao />} />
    </Routes>
  );
}

export default App;
