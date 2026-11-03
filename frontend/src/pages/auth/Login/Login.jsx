// Tela 01 — Login (RF01)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../utils/api';
import { homeDoPerfil } from '../../../utils/perfil';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const podeEnviar = email.trim() !== '' && senha.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    const identificador = email.trim();

    const pareceEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador);
    const pareceMatricula = /^[0-9]{2}[1-2][0-9]{4}$/.test(identificador);

    if (!pareceEmail && !pareceMatricula) {
      setErro('Informe um e-mail válido ou uma matrícula no formato correto.')
      return;
    }

    try {
      const resposta = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ identificador, senha })
      })
      const dados = await resposta.json();
      if (!resposta.ok) {
        const mensagem = Array.isArray(dados.erros)
          ? dados.erros.join(' ')
          : dados.mensagem || 'Não foi possível entrar.'
        setErro(mensagem)
        return;
      }
      // Admin vai para /admin/home, aluno para /home
      navigate(homeDoPerfil(dados.usuario?.TipoUsuario), { replace: true })

    } catch {
      setErro('Não foi possível concluir o login. Tente novamente.')
    }

  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-logo">Unifor Sports Hub</h2>

        <h1>Entrar</h1>
        <p className="login-subtitulo">Acesse com seu e-mail ou matrícula</p>

        {erro && <p className="login-erro">{erro}</p>}

        <label>
          E-mail ou matrícula
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex.: aluno@edu.unifor.br"
          />
        </label>

        <label>
          Senha
          <div className="login-senha-wrapper">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button
              type="button"
              className="login-olho"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? (
                // estava "🙈" -> agora olho fechado (SVG cinza)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M3 3l18 18" strokeLinecap="round" />
                  <path d="M10.58 10.58a2 2 0 102.83 2.83" strokeLinecap="round" />
                  <path d="M9.88 5.09A9.77 9.77 0 0112 5c6 0 10 7 10 7a16.3 16.3 0 01-3.22 3.94M6.1 6.1A16.4 16.4 0 002 12s4 7 10 7a9.7 9.7 0 004.17-.94" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                // estava "👁️" -> agora olho aberto (SVG cinza)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </label>

        <Link to="/esqueci-senha" className="login-esqueceu">
          Esqueceu a senha?
        </Link>

        <button type="submit" className="login-botao" disabled={!podeEnviar}>
          Entrar
        </button>

        <p className="login-cadastro-link">
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;