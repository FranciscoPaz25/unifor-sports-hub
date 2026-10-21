import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import RotaProtegida from './components/RotaProtegida/RotaProtegida';

import Login from './pages/auth/Login/Login';
import Cadastro from './pages/auth/Cadastro/Cadastro';
import EsqueceuSenha from './pages/auth/EsqueceuSenha/EsqueceuSenha';

import Home from './pages/aluno/Home/Home';
import Esportes from './pages/aluno/Esportes/Esportes';
import MinhasInscricoes from './pages/aluno/MinhasInscricoes/MinhasInscricoes';
import DetalhesInscricao from './pages/aluno/DetalhesInscricao/DetalhesInscricao';

import DetalhesEsporte from './pages/compartilhadas/DetalhesEsporte/DetalhesEsporte';
import Configuracoes from './pages/compartilhadas/Configuracoes/Configuracoes';

import Gerencia from './pages/admin/Gerencia/Gerencia';
import CriarEsporte from './pages/admin/CriarEsporte/CriarEsporte';
import AceitarResenhas from './pages/admin/AceitarResenhas/AceitarResenhas';
import CriarEvento from './pages/admin/CriarEvento/CriarEvento';
import GerenciarInscricoes from './pages/admin/GerenciarInscricoes/GerenciarInscricoes';

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
      <Route path="/esqueci-senha" element={<EsqueceuSenha />} />

      <Route element={<RotaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/esportes" element={<Esportes />} />
          <Route path="/esportes/:id" element={<DetalhesEsporte />} />
          <Route path="/minhas-inscricoes" element={<MinhasInscricoes />} />
          <Route
            path="/minhas-inscricoes/:id"
            element={<DetalhesInscricao />}
          />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/eventos" element={<EmConstrucao />} />
        </Route>

        <Route path="/admin" element={<Layout />}>
          <Route path="home" element={<EmConstrucao />} />
          <Route path="eventos" element={<EmConstrucao />} />
          <Route path="gerencia" element={<Gerencia />} />
          <Route path="gerencia/criar-esporte" element={<CriarEsporte />} />
          <Route
            path="gerencia/inscricoes"
            element={<GerenciarInscricoes />}
          />
          <Route path="gerencia/resenhas" element={<AceitarResenhas />} />
          <Route path="gerencia/criar-evento" element={<CriarEvento />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Route>

      <Route path="*" element={<EmConstrucao />} />
    </Routes>
  );
}

export default App;