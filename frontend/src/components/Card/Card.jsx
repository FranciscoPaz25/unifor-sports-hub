import './Card.css';

function Card({ nome, local, vagas, onInscrever }) {
  return (
    <div className="card-esporte">
      <div className="card-esporte-imagem" aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18M5.6 5.6c2 2.4 2 8.4 0 12.8M18.4 5.6c-2 2.4-2 8.4 0 12.8" strokeLinecap="round" />
        </svg>
      </div>
      <div className="card-esporte-corpo">
        <h3 className="card-esporte-nome">{nome}</h3>
        <p className="card-esporte-local">{local}</p>
        <span className="card-esporte-vagas">{vagas} vagas disponíveis</span>
        <button type="button" className="card-esporte-botao" onClick={onInscrever}>
          Inscrever-se
        </button>
      </div>
    </div>
  );
}

export default Card;
