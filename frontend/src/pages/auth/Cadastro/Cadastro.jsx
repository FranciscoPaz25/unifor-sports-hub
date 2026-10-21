// Tela 02 — Cadastro (RF02)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cadastro.css';

function calcularForcaSenha(senha) {
  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) pontos++;

  if (senha.length === 0) return { nivel: 0, label: '' };
  if (pontos <= 1) return { nivel: 1, label: 'Fraca' };
  if (pontos <= 2) return { nivel: 2, label: 'Média' };
  return { nivel: 3, label: 'Forte' };
}

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [erroEmail, setErroEmail] = useState('');
  const [erroMatricula, setErroMatricula] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  const forca = calcularForcaSenha(senha);

  const podeEnviar =
    nome.trim() !== '' &&
    email.trim() !== '' &&
    matricula.trim() !== '' &&
    senha.trim() !== '' &&
    confirmarSenha.trim() !== '';

  function handleSubmit(e) {
    e.preventDefault();

    // RF02.5: domínio institucional
    if (!email.endsWith('@edu.unifor.br')) {
      setErroEmail('Use seu e-mail institucional (@edu.unifor.br)');
      return;
    }
    setErroEmail('');

    // Matrícula Unifor: 7 dígitos (ano com 2 dígitos + semestre 1 ou 2 + 4 dígitos).
    // Mesmo padrão do CHECK chk_matricula_unifor no banco.
    if (!/^[0-9]{2}[1-2][0-9]{4}$/.test(matricula.trim())) {
      setErroMatricula('Matrícula inválida. São 7 dígitos: ano (2), semestre (1 ou 2) e número (4). Ex.: 2312345');
      return;
    }
    setErroMatricula('');

    // RF02.10: senha e confirmação precisam bater
    if (senha !== confirmarSenha) {
      setErroSenha('Erro ao confirmar senha. Verifique os padrões solicitados.');
      return;
    }
    setErroSenha('');

    // TODO: substituir por chamada real ao backend (RF02.12) quando a API de cadastro existir
    console.log('Novo cadastro:', { nome, email, matricula, senha });

    // RF02.13: redireciona para o login após o cadastro
    navigate('/');
  }

  return (
    <div className="cadastro-container">
      <form className="cadastro-card" onSubmit={handleSubmit}>
        <h2 className="cadastro-logo">Unifor Sports Hub</h2>

        <h1>Criar conta</h1>
        <p className="cadastro-subtitulo">Cadastre-se com seus dados de estudante</p>

        <label>
          Nome completo
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>

        <label>
          E-mail institucional
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex.: aluno@edu.unifor.br"
          />
          {erroEmail && <span className="cadastro-campo-erro">{erroEmail}</span>}
        </label>

        <label>
          Matrícula
          <input
            type="text"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            inputMode="numeric"
            maxLength={7}
            placeholder="ex.: 2312345"
          />
          {erroMatricula && <span className="cadastro-campo-erro">{erroMatricula}</span>}
        </label>

        <label>
          Senha
          <div className="cadastro-senha-wrapper">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button
              type="button"
              className="cadastro-olho"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M3 3l18 18" strokeLinecap="round" />
                  <path d="M10.58 10.58a2 2 0 102.83 2.83" strokeLinecap="round" />
                  <path d="M9.88 5.09A9.77 9.77 0 0112 5c6 0 10 7 10 7a16.3 16.3 0 01-3.22 3.94M6.1 6.1A16.4 16.4 0 002 12s4 7 10 7a9.7 9.7 0 004.17-.94" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {senha && (
            <>
              <div className="cadastro-forca-barra">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={i <= forca.nivel ? `ativa ${forca.label.toLowerCase()}` : ''}
                  />
                ))}
              </div>
              <span className="cadastro-forca-texto">{forca.label}</span>
            </>
          )}
        </label>

        <label>
          Confirmar senha
          <div className="cadastro-senha-wrapper">
            <input
              type={mostrarConfirmarSenha ? 'text' : 'password'}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            <button
              type="button"
              className="cadastro-olho"
              onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
            >
              {mostrarConfirmarSenha ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M3 3l18 18" strokeLinecap="round" />
                  <path d="M10.58 10.58a2 2 0 102.83 2.83" strokeLinecap="round" />
                  <path d="M9.88 5.09A9.77 9.77 0 0112 5c6 0 10 7 10 7a16.3 16.3 0 01-3.22 3.94M6.1 6.1A16.4 16.4 0 002 12s4 7 10 7a9.7 9.7 0 004.17-.94" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {erroSenha && <span className="cadastro-campo-erro">{erroSenha}</span>}
        </label>

        <button type="submit" className="cadastro-botao" disabled={!podeEnviar}>
          Criar conta
        </button>

        <p className="cadastro-login-link">
          Já tem conta? <Link to="/">Entrar</Link>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;