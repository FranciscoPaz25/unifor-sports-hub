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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<Layout tipoUsuario="aluno" />}>
        <Route path="/home" element={<Home />} />
        <Route path="/esportes" element={<Esportes />} />
        <Route path="/esportes/:id" element={<DetalhesEsporte />} />
        <Route path="/minhas-inscricoes" element={<MinhasInscricoes />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>

      <Route path="/admin" element={<Layout tipoUsuario="admin" />}>
        <Route path="gerencia" element={<Gerencia />} />
        <Route path="gerencia/criar-esporte" element={<CriarEsporte />} />
        <Route path="gerencia/inscricoes" element={<GerenciarInscricoes />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  );
}

export default App;