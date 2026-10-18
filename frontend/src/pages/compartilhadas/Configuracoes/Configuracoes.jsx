// Tela 17 — Configurações (RF17)
import { useState } from 'react';
import { usuario } from '../../../mocks/usuario';
import PopupSairConta from '../../../popups/PopupSairConta/PopupSairConta';
import './Configuracoes.css';

function IconeOlho({ visivel }) {
  return visivel ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.58 10.58a2 2 0 102.83 2.83" strokeLinecap="round" />
      <path d="M9.88 5.09A9.77 9.77 0 0112 5c6 0 10 7 10 7a16.3 16.3 0 01-3.22 3.94M6.1 6.1A16.4 16.4 0 002 12s4 7 10 7a9.7 9.7 0 004.17-.94" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Configuracoes() {
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [erroPerfil, setErroPerfil] = useState('');
  const [sucessoPerfil, setSucessoPerfil] = useState('');

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState('');
  const [sucessoSenha, setSucessoSenha] = useState('');

  const [mostrarPopupSair, setMostrarPopupSair] = useState(false);

  function handleSalvarPerfil(e) {
    e.preventDefault();
    setSucessoPerfil('');

    // RF17.7
    if (nome.trim() === '' || email.trim() === '') {
      setErroPerfil('Preencha nome completo e e-mail institucional.');
      return;
    }
    setErroPerfil('');

    // RF17.6 — TODO: substituir por PUT /usuarios/:id quando o backend existir
    usuario.nome = nome;
    usuario.email = email;

    // RF17.8
    setSucessoPerfil('Dados atualizados com sucesso.');
  }

  function handleAtualizarSenha(e) {
    e.preventDefault();
    setSucessoSenha('');

    // RF17.11
    if (senhaAtual !== usuario.senha) {
      setErroSenha('Senha atual incorreta.');
      return;
    }

    // RF17.12
    if (novaSenha !== confirmarNovaSenha) {
      setErroSenha('As senhas não coincidem.');
      return;
    }
    setErroSenha('');

    // RF17.10 — TODO: substituir por PUT /usuarios/:id/senha quando o backend existir
    usuario.senha = novaSenha;

    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarNovaSenha('');

    // RF17.13
    setSucessoSenha('Senha atualizada com sucesso.');
  }

  return (
    <div className="config-container">
      <h1>Configurações</h1>

      <form className="config-secao" onSubmit={handleSalvarPerfil}>
        <h2>Dados do perfil</h2>

        <label>
          Nome completo
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>

        <label>
          E-mail institucional
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Matrícula
          <input type="text" value={usuario.matricula} readOnly className="config-input-readonly" />
        </label>

        {erroPerfil && <p className="config-erro">{erroPerfil}</p>}
        {sucessoPerfil && <p className="config-sucesso">{sucessoPerfil}</p>}

        <button type="submit" className="config-botao">Salvar alterações</button>
      </form>

      <form className="config-secao" onSubmit={handleAtualizarSenha}>
        <h2>Alterar senha</h2>

        <label>
          Senha atual
          <div className="config-senha-wrapper">
            <input
              type={mostrarSenhaAtual ? 'text' : 'password'}
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
            <button type="button" className="config-olho" onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}>
              <IconeOlho visivel={mostrarSenhaAtual} />
            </button>
          </div>
        </label>

        <label>
          Nova senha
          <div className="config-senha-wrapper">
            <input
              type={mostrarNovaSenha ? 'text' : 'password'}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <button type="button" className="config-olho" onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}>
              <IconeOlho visivel={mostrarNovaSenha} />
            </button>
          </div>
        </label>

        <label>
          Confirmar nova senha
          <div className="config-senha-wrapper">
            <input
              type={mostrarConfirmarSenha ? 'text' : 'password'}
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)}
            />
            <button type="button" className="config-olho" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
              <IconeOlho visivel={mostrarConfirmarSenha} />
            </button>
          </div>
        </label>

        {erroSenha && <p className="config-erro">{erroSenha}</p>}
        {sucessoSenha && <p className="config-sucesso">{sucessoSenha}</p>}

        <button type="submit" className="config-botao">Atualizar senha</button>
      </form>

      <hr className="config-divisoria" />

      <button type="button" className="config-botao-sair" onClick={() => setMostrarPopupSair(true)}>
        Sair da conta
      </button>

      {mostrarPopupSair && <PopupSairConta onClose={() => setMostrarPopupSair(false)} />}
    </div>
  );
}

export default Configuracoes;
