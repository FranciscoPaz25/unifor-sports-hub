import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { homeDoPerfil } from '../../utils/perfil';

// Usado dentro de RotaProtegida: só renderiza as rotas filhas se o usuário logado
// tiver o perfil exigido; senão, manda para a home do próprio perfil.
// Isso só organiza a navegação — quem garante a permissão é o backend (exigirAdmin).
function ExigirPerfil({ perfil }) {
  const contexto = useOutletContext();
  const tipoUsuario = contexto.usuario.TipoUsuario;

  if (tipoUsuario !== perfil) {
    return <Navigate to={homeDoPerfil(tipoUsuario)} replace />;
  }

  return <Outlet context={contexto} />;
}

export default ExigirPerfil;
