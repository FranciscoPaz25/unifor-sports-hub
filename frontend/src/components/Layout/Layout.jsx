import { Outlet, useOutletContext } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

function Layout() {
  const { usuario, atualizarUsuario} = useOutletContext()

  const nomeUsuario = usuario.Nome;
  const tipoUsuario = usuario.TipoUsuario;

  return (
    <>
      <Navbar tipoUsuario={tipoUsuario} nomeUsuario={nomeUsuario} />
      <Outlet context={{
         usuario,
         tipoUsuario,
         nomeUsuario,
         atualizarUsuario 
        }} />
    </>
  );
}

export default Layout;
