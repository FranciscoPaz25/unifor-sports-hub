import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar({ tipoUsuario, nomeUsuario }) {
  const iniciais = nomeUsuario ? nomeUsuario.trim().charAt(0).toUpperCase() : '?';

  function linkClass({ isActive }) {
    return isActive ? 'navbar-link-ativo' : undefined;
  }

  return (
    <nav className="navbar">
      <span className="navbar-logo">Unifor Sports Hub</span>

      <div className="navbar-links">
        {tipoUsuario === 'aluno' && (
          <>
            <NavLink to="/home" className={linkClass}>Home</NavLink>
            <NavLink to="/esportes" className={linkClass}>Esportes</NavLink>
            <NavLink to="/minhas-inscricoes" className={linkClass}>Minhas inscrições</NavLink>
            <NavLink to="/eventos" className={linkClass}>Eventos</NavLink>
            <NavLink to="/configuracoes" className={linkClass}>Configurações</NavLink>
          </>
        )}
        {tipoUsuario === 'admin' && (
          <>
            <NavLink to="/admin/home" className={linkClass}>Home</NavLink>
            <NavLink to="/esportes" className={linkClass}>Esportes</NavLink>
            <NavLink to="/admin/eventos" className={linkClass}>Eventos</NavLink>
            <NavLink to="/admin/gerencia" className={linkClass}>Gerência</NavLink>
            <NavLink to="/admin/configuracoes" className={linkClass}>Configurações</NavLink>
          </>
        )}
      </div>

      <div className="navbar-usuario">
        {/* Tela 24 — Ajuda: botão "?" ao lado do avatar, fora dos itens fixos da navbar */}
        <NavLink
          to="/ajuda"
          className={({ isActive }) => `navbar-ajuda${isActive ? ' navbar-ajuda-ativo' : ''}`}
          title="Ajuda"
          aria-label="Ajuda"
        >
          ?
        </NavLink>
        <span className="navbar-avatar">{iniciais}</span>
        <span className="navbar-nome">{nomeUsuario}</span>
      </div>
    </nav>
  );
}

export default Navbar;
