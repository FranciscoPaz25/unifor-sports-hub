// Tela 17 — Configurações (RF17)
import { useState } from 'react';
import PopupSairConta from '../../../popups/PopupSairConta/PopupSairConta';
import './Configuracoes.css';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { validarEmailInstitucional } from '../../../utils/validacao';
import { API_URL } from '../../../utils/api';

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
  const { usuario, atualizarUsuario } = useOutletContext();
  const [nome, setNome] = useState(usuario.Nome);
  const [email, setEmail] = useState(usuario.Email);
  const [erroPerfil, setErroPerfil] = useState('');
  const [sucessoPerfil, setSucessoPerfil] = useState('');

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState('');
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [mostrarPopupSair, setMostrarPopupSair] = useState(false);
  const navigate = useNavigate();


  async function handleSalvarPerfil(e) {
    e.preventDefault();
    setSucessoPerfil('');

    // RF17.7
    if (nome.trim() === '' || email.trim() === '') {
      setErroPerfil('Preencha nome completo e e-mail institucional.');
      return;
    }

    const erroEmail = validarEmailInstitucional(email, usuario.TipoUsuario)
    if (erroEmail) {
      setErroPerfil(erroEmail);
      return
    }

    setErroPerfil('')


    try {
      const resposta = await fetch(
        `${API_URL}/api/usuarios/me`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ nome, email })
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        const mensagem = Array.isArray(dados.erros)
          ? dados.erros.join(' ')
          : dados.mensagem || 'Não foi possível atualizar o perfil';
        setErroPerfil(mensagem)
        return;
      }

      atualizarUsuario(dados.usuario)
      setNome(dados.usuario.Nome);
      setEmail(dados.usuario.Email);
      setSucessoPerfil('Dados atualizados com sucesso.')

    } catch {
      setErroPerfil('Não foi possível concluir a atualização. Tente novamente.')
    }

  }

  async function handleAtualizarSenha(e) {
    e.preventDefault();

    if (alterandoSenha) return;
    setErroSenha('');

    if (
      senhaAtual.length === 0 ||
      novaSenha.length === 0 ||
      confirmarNovaSenha.length === 0
    ) {
      setErroSenha('Preencha todos os campos de senha.');
      return;
    }

    if (novaSenha.length < 15 || novaSenha.length > 128) {
      setErroSenha('A nova senha deve ter entre 15 e 128 caracteres.');
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setErroSenha('As senhas não coincidem.');
      return;
    }

    setAlterandoSenha(true);

    try {
      const resposta = await fetch(
        `${API_URL}/api/usuarios/me/senha`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senhaAtual,
            novaSenha,
            confirmarNovaSenha,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        const mensagem = Array.isArray(dados.erros)
          ? dados.erros.join(' ')
          : dados.mensagem || 'Não foi possível alterar a senha.';

        setErroSenha(mensagem);
        return;
      }

      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarNovaSenha('');

      navigate('/', { replace: true });
    } catch {
      setErroSenha(
        'Não foi possível confirmar a alteração. Tente entrar novamente para verificar.'
      );
    } finally {
      setAlterandoSenha(false);
    }
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
          <input type="text" value={usuario.Matricula} readOnly className="config-input-readonly" />
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

        <button
          type="submit"
          className="config-botao"
          disabled={alterandoSenha}
        >
          {alterandoSenha ? 'Alterando…' : 'Atualizar senha'}
        </button>
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
