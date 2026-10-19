// Tela 11 — Detalhes da inscrição (RF11)
// Aberta pelo "Ver detalhes" de uma inscrição em esporte na tela Minhas inscrições (RF10.9).
import { useParams, useNavigate, Link } from 'react-router-dom';
import { esportes } from '../../../mocks/esportes';
import { minhasInscricoes } from '../../../mocks/inscricoes';
import './DetalhesInscricao.css';

const statusLabel = {
  em_analise: 'Em análise',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
};

const icones = {
  local: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.9">
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
  horario: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.9">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  data: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.9">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  ),
  responsavel: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.9">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" strokeLinecap="round" />
    </svg>
  ),
  capacidade: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.9">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" strokeLinecap="round" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 13.8c2.1.8 3.5 3 3.5 6.2" strokeLinecap="round" />
    </svg>
  ),
};

// "2026-09-20T10:00:00Z" -> "20/09/2026 às 07:00" (no fuso do navegador)
function formatarDataHora(iso) {
  const data = new Date(iso);
  const dia = data.toLocaleDateString('pt-BR');
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dia} às ${hora}`;
}

function DetalhesInscricao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const inscricao = minhasInscricoes.find((i) => i.id === Number(id) && i.tipo === 'esporte');
  const esporte = inscricao && esportes.find((e) => e.id === inscricao.refId);

  if (!inscricao || !esporte) {
    return (
      <div className="det-inscricao-container">
        <p className="det-inscricao-nao-encontrada">Inscrição não encontrada.</p>
        <Link to="/minhas-inscricoes" className="det-inscricao-link">Voltar para Minhas inscrições</Link>
      </div>
    );
  }

  function handleCancelar() {
    // Age direto, sem popup de confirmação (decisoes.md).
    // TODO: substituir por PATCH /inscricoes/:id (status cancelada) quando o backend existir
    inscricao.status = 'cancelada';
    navigate('/minhas-inscricoes');
  }

  const informacoes = [
    { icone: 'data', rotulo: 'Data da inscrição', valor: formatarDataHora(inscricao.criadoEm) },
    { icone: 'responsavel', rotulo: 'Responsável/professor', valor: esporte.responsavel },
    { icone: 'capacidade', rotulo: 'Capacidade máxima de vagas', valor: `${esporte.capacidadeMaxima} vagas` },
  ];

  return (
    <div className="det-inscricao-container">
      <div className="det-inscricao-cabecalho">
        <Link to="/minhas-inscricoes" className="det-inscricao-voltar" aria-label="Voltar para Minhas inscrições">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1>Detalhes da inscrição</h1>
      </div>

      <div className="det-inscricao-card">
        <div className="det-inscricao-topo">
          <strong>{esporte.nome}</strong>
          <span className={`det-inscricao-status det-inscricao-status-${inscricao.status}`}>
            {statusLabel[inscricao.status]}
          </span>
        </div>
        <span className="det-inscricao-linha">
          {icones.local} {esporte.local}
        </span>
        <span className="det-inscricao-linha">
          {icones.horario} {esporte.diasSemana} • {esporte.horarioInicio} às {esporte.horarioFim}
        </span>
      </div>

      <section>
        <h2>Informações da inscrição</h2>
        <ul className="det-inscricao-informacoes">
          {informacoes.map((info) => (
            <li key={info.rotulo}>
              <span className="det-inscricao-info-icone" aria-hidden="true">{icones[info.icone]}</span>
              <div>
                <span className="det-inscricao-info-rotulo">{info.rotulo}</span>
                <strong>{info.valor}</strong>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {inscricao.status !== 'cancelada' && (
        <button type="button" className="det-inscricao-cancelar" onClick={handleCancelar}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
          </svg>
          Cancelar inscrição
        </button>
      )}
    </div>
  );
}

export default DetalhesInscricao;
