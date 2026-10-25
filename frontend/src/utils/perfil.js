// Tela inicial de cada perfil: usada após o login e ao barrar acesso a telas de outro perfil.
export function homeDoPerfil(tipoUsuario) {
  return tipoUsuario === 'admin' ? '/admin/home' : '/home';
}
