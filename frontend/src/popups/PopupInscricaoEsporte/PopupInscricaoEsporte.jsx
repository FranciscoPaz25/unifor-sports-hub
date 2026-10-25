// Tela 09 — Popup de confirmar inscrição no esporte (RF09)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chamarApi, mensagemDeErro } from '../../utils/api';
import './PopupInscricaoEsporte.css';

// Texto padronizado em specs/decisoes.md
const ERRO_INSCRICAO = 'Erro, verifique se você já está inscrito no esporte ou se as vagas acabaram';

function PopupInscricaoEsporte({ esporte, onClose }) {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleConfirmar() {
    if (enviando) return;
    if (esporte.vagas === 0) {
      setErro(ERRO_INSCRICAO);
      return;
    }

    // A inscrição nasce "em análise"; o admin aceita ou rejeita na tela 23
    setErro('');
    setEnviando(true);
    try {
      const { ok, dados } = await chamarApi('/api/inscricoes-esporte', {
        metodo: 'POST',
        corpo: { idEsporte: esporte.id },
      });
      if (!ok) {
        setErro(mensagemDeErro(dados, ERRO_INSCRICAO));
        return;
      }
      navigate('/minhas-inscricoes');
    } catch {
      setErro('Não foi possível enviar a inscrição. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <div className="popup-topo">
          <h2>Confirmar inscrição</h2>
          <button type="button" className="popup-fechar" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="popup-resumo">
          <strong>{esporte.nome}</strong>
          <span>{esporte.diasSemana}</span>
          <span>{esporte.local}</span>
          <span>{esporte.horarioInicio} às {esporte.horarioFim}</span>
          <span className="popup-vagas">
            <i className="popup-vagas-ponto" />
            {esporte.vagas} vagas disponíveis
          </span>
        </div>

        {erro && <p className="popup-erro">{erro}</p>}

        <div className="popup-botoes">
          <button type="button" className="popup-botao-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="popup-botao-confirmar" onClick={handleConfirmar} disabled={enviando}>
            {enviando ? 'Enviando…' : 'Confirmar inscrição'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupInscricaoEsporte;
