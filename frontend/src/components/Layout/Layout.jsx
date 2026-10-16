import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

function Layout({ tipoUsuario, nomeUsuario }) {
  return (
    <>
      <Navbar tipoUsuario={tipoUsuario} nomeUsuario={nomeUsuario} />
      <Outlet context={{ tipoUsuario, nomeUsuario }} />
    </>
  );
}

export default Layout;
