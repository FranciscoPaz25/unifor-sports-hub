import { useNavigate } from 'react-router-dom';
import './PopupSairConta.css';

function PopupSairConta({ onClose }) {
  const navigate = useNavigate();

  function handleSair() {
    // TODO: limpar sessão/token real quando o login existir
    navigate('/');
  }

  return (
    <div className="popup-sair-overlay" onClick={onClose}>
      <div className="popup-sair-card" onClick={(e) => e.stopPropagation()}>
        <div className="popup-sair-topo">
          <h2>Sair da conta</h2>
          <button type="button" className="popup-sair-fechar" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <p>Tem certeza que deseja encerrar sua sessão?</p>

        <div className="popup-sair-botoes">
          <button type="button" className="popup-sair-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="popup-sair-confirmar" onClick={handleSair}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupSairConta;
