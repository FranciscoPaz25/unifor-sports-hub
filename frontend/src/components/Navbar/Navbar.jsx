import { Link } from 'react-router-dom';

function Navbar({ tipoUsuario }) {
  return (
    <nav>
      <span>Unifor Sports Hub</span>
      {tipoUsuario === 'aluno' && (
        <>
          <Link to="/home">Home</Link>
          <Link to="/esportes">Esportes</Link>
          <Link to="/minhas-inscricoes">Minhas inscrições</Link>
          <Link to="/eventos">Eventos</Link>
          <Link to="/configuracoes">Configurações</Link>
        </>
      )}
      {tipoUsuario === 'admin' && (
        <>
          <Link to="/admin/home">Home</Link>
          <Link to="/admin/eventos">Eventos</Link>
          <Link to="/admin/gerencia">Gerência</Link>
          <Link to="/admin/configuracoes">Configurações</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
