import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

function Layout({ tipoUsuario }) {
  return (
    <>
      <Navbar tipoUsuario={tipoUsuario} />
      <Outlet />
    </>
  );
}

export default Layout;