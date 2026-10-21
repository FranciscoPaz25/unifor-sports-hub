import { useNavigate } from 'react-router-dom';
import './PopupSairConta.css';
import { useState } from 'react';

function PopupSairConta({ onClose }) {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [saindo, setSaindo] = useState(false);

  async function handleSair() {
    if (saindo) return;

    setErro('')
    setSaindo(true);

    try {
      const resposta = await fetch(
        'http://192.168.15.7:3000/api/auth/logout',
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      if (!resposta.ok) {
        setErro('Não foi possível sair. Tente novamente.');
        return;
      }

      navigate('/', {
        replace: true
      });
    } catch {
      setErro('Não foi possível comunicar com o servidor.')
    } finally {
      setSaindo(false);
    }

  }

  return (
    <div className="popup-sair-overlay" onClick={() => {
      if(!saindo) onClose();
    }}>
      <div className="popup-sair-card" onClick={(e) => e.stopPropagation()}>
        <div className="popup-sair-topo">
          <h2>Sair da conta</h2>
          <button type="button" className="popup-sair-fechar" onClick={onClose} aria-label="Fechar" disabled={saindo}>
            ✕
          </button>
        </div>

        <p>Tem certeza que deseja encerrar sua sessão?</p>
        {erro && <p role="alert">{erro}</p>}

        <div className="popup-sair-botoes">
          <button type="button" className="popup-sair-cancelar" onClick={onClose} disabled={saindo}>
            Cancelar
          </button>
          <button
            type="button"
            className="popup-sair-confirmar"
            onClick={handleSair}
            disabled={saindo}
          >
            {saindo ? 'Saindo…' : 'Sair'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupSairConta;
