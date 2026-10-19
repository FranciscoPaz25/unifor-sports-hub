// Tela 03 — Esqueceu a senha (RF03)
// Fora do MVP: só o visual. Não consulta o banco nem envia e-mail de verdade.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './EsqueceuSenha.css';

const DOMINIO = '@edu.unifor.br';

function IconeVoltar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EsqueceuSenha() {
  const [email, setEmail] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [reenviado, setReenviado] = useState(false);

  // RF03.7: só libera o envio com o campo preenchido
  const podeEnviar = email.trim() !== '';

  function handleSubmit(e) {
    e.preventDefault();

    // RF03.6: domínio institucional
    if (!email.trim().endsWith(DOMINIO)) {
      setErroEmail('Insira seu e-mail institucional UNIFOR');
      return;
    }
    setErroEmail('');

    // TODO: RF03.8 / RF03.9 — substituir por POST /auth/esqueci-senha quando o backend existir
    // (validar se o e-mail está cadastrado e enviar o link de redefinição)
    console.log('Recuperação de senha solicitada para:', email.trim());
    setEnviado(true);
  }

  function handleReenviar() {
    // TODO: RF03.12 — reenviar via POST /auth/esqueci-senha quando o backend existir
    console.log('Reenvio de recuperação para:', email.trim());
    setReenviado(true);
  }

  return (
    <div className="esqueceu-container">
      {enviado ? (
        // RF03.10 a RF03.13: confirmação
        <div className="esqueceu-card">
          <h2 className="esqueceu-logo">Unifor Sports Hub</h2>

          <div className="esqueceu-icone">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1>E-mail enviado!</h1>
          <p className="esqueceu-subtitulo">
            Enviamos um link de redefinição de senha para o seu e-mail institucional. Verifique
            também a sua caixa de spam.
          </p>

          <div className="esqueceu-destinatario">
            <span className="esqueceu-destinatario-rotulo">Destinatário confirmado:</span>
            <span className="esqueceu-destinatario-email">{email.trim()}</span>
          </div>

          <Link to="/" className="esqueceu-botao-secundario">
            <IconeVoltar /> Voltar para o login
          </Link>

          <p className="esqueceu-reenviar">
            {reenviado ? (
              'E-mail reenviado.'
            ) : (
              <>
                Não recebeu o e-mail?{' '}
                <button type="button" onClick={handleReenviar}>
                  Reenviar agora
                </button>
              </>
            )}
          </p>
        </div>
      ) : (
        <form className="esqueceu-card" onSubmit={handleSubmit}>
          {/* RF03.1: seta de retorno pro login */}
          <Link to="/" className="esqueceu-seta" aria-label="Voltar para o login">
            <IconeVoltar />
          </Link>

          <h2 className="esqueceu-logo">Unifor Sports Hub</h2>

          {/* RF03.3: ícone de recuperação */}
          <div className="esqueceu-icone">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="2">
              <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1>Esqueceu a senha?</h1>
          <p className="esqueceu-subtitulo">
            Informe seu e-mail cadastrado para receber as instruções de recuperação
          </p>

          {/* RF03.5: campo com indicação do domínio */}
          <label>
            <span className="esqueceu-rotulo">
              E-mail institucional
              <span className="esqueceu-dominio">{DOMINIO}</span>
            </span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex.: aluno@edu.unifor.br"
            />
            {erroEmail && <span className="esqueceu-campo-erro">{erroEmail}</span>}
          </label>

          <button type="submit" className="esqueceu-botao" disabled={!podeEnviar}>
            Enviar instruções
          </button>

          {/* RF03.13 */}
          <Link to="/" className="esqueceu-voltar">
            <IconeVoltar /> Voltar para o login
          </Link>
        </form>
      )}
    </div>
  );
}

export default EsqueceuSenha;
