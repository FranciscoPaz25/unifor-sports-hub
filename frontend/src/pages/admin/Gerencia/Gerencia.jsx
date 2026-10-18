// Tela 19 — Gerência (RF19)
import { Link } from 'react-router-dom';
import './Gerencia.css';

const icones = {
  criarEsporte: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M3.5 9h17M3.5 15h17" strokeLinecap="round" />
    </svg>
  ),
  aceitarEsporte: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <path d="M15.5 11.5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  aceitarResenha: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M12 7.5l1.2 2.5 2.7.3-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.3z" strokeLinejoin="round" />
      <path d="M8 21h8" strokeLinecap="round" />
    </svg>
  ),
  criarEvento: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
      <path d="M9 15l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// RF19.5 a RF19.8
const cards = [
  {
    icone: 'criarEsporte',
    titulo: 'Criar esportes',
    subtitulo: 'Cadastrar e editar modalidades esportivas',
    link: '/admin/gerencia/criar-esporte',
  },
  {
    icone: 'aceitarEsporte',
    titulo: 'Aceitar esportes',
    subtitulo: 'Aprovar ou recusar inscrições de alunos pendentes de análise',
    link: '/admin/gerencia/inscricoes',
  },
  {
    icone: 'aceitarResenha',
    titulo: 'Aceitar resenhas',
    subtitulo: 'Moderar avaliações enviadas',
    link: '/admin/gerencia/resenhas',
  },
  {
    icone: 'criarEvento',
    titulo: 'Criar eventos',
    subtitulo: 'Cadastrar e gerenciar competições',
    link: '/admin/gerencia/criar-evento',
  },
];

function Gerencia() {
  return (
    <div className="gerencia-container">
      <h1>Gerência</h1>

      <div className="gerencia-grid">
        {cards.map((card) => (
          <Link key={card.titulo} to={card.link} className="gerencia-card">
            <span className="gerencia-card-icone">{icones[card.icone]}</span>
            <h2>{card.titulo}</h2>
            <p>{card.subtitulo}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Gerencia;
