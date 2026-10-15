import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jaInscritoEsporte, registrarInscricaoEsporte } from '../../mocks/inscricoes';
import './PopupInscricaoEsporte.css';

function PopupInscricaoEsporte({ esporte, onClose }) {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');

  function handleConfirmar() {
    if (jaInscritoEsporte(esporte.id) || esporte.vagas === 0) {
      setErro('Erro, verifique se você já está inscrito no esporte ou se as vagas acabaram');
      return;
    }

    registrarInscricaoEsporte(esporte.id);
    navigate('/minhas-inscricoes');
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
          <button type="button" className="popup-botao-confirmar" onClick={handleConfirmar}>
            Confirmar inscrição
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupInscricaoEsporte;
