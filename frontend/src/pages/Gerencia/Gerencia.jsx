import { Link } from 'react-router-dom';
import './Gerencia.css';

const icones = {
  criarEsporte: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  ),
  aceitarEsporte: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8">
      <path d="M4 12l5 5 11-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  aceitarResenha: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z" strokeLinejoin="round" />
    </svg>
  ),
  criarEvento: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  ),
};

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
            <div className="gerencia-card-icone">{icones[card.icone]}</div>
            <div>
              <h2>{card.titulo}</h2>
              <p>{card.subtitulo}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Gerencia;
