// Tela 10 — Minhas inscrições (RF10)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chamarApi, mensagemDeErro } from '../../../utils/api';
import { eventos } from '../../../mocks/eventos';
import { inscricoesEventos } from '../../../mocks/inscricoes';
import './MinhasInscricoes.css';

const statusLabel = {
  em_analise: 'Em análise',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  rejeitada: 'Rejeitada',
};

// Eventos ainda vêm do mock (módulo de eventos fora do MVP essencial)
const itensEventos = inscricoesEventos
  .map((inscricao) => {
    const evento = eventos.find((e) => e.id === inscricao.refId);
    if (!evento) return null;
    return {
      chave: `evento-${inscricao.id}`,
      nome: evento.nome,
      status: inscricao.status,
      criadoEm: inscricao.criadoEm,
      local: evento.local,
      horario: `${evento.data} · ${evento.horario}`,
      destino: `/eventos/${evento.id}`, // RF15 — ainda não existe
    };
  })
  .filter(Boolean);

function MinhasInscricoes() {
  const navigate = useNavigate();
  const [itensEsportes, setItensEsportes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const { ok, dados } = await chamarApi('/api/inscricoes-esporte');
        if (!ok) {
          setErro(mensagemDeErro(dados, 'Não foi possível carregar suas inscrições.'));
          return;
        }
        setItensEsportes(dados.inscricoes.map((inscricao) => ({
          chave: `esporte-${inscricao.id}`,
          nome: inscricao.esporte.nome,
          status: inscricao.status,
          criadoEm: inscricao.criadoEm,
          local: inscricao.esporte.local,
          horario: `${inscricao.esporte.diasSemana} · ${inscricao.esporte.horarioInicio} às ${inscricao.esporte.horarioFim}`,
          destino: `/minhas-inscricoes/${inscricao.id}`, // RF11
        })));
      } catch {
        setErro('Não foi possível carregar suas inscrições.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // RF10.4: ordenadas da mais recente para a mais antiga
  const itensOrdenados = [...itensEsportes, ...itensEventos].sort(
    (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
  );

  return (
    <div className="inscricoes-container">
      {/* RF10.3 */}
      <h1>Minhas inscrições</h1>

      {carregando ? (
        <p className="inscricoes-vazio">Carregando inscrições…</p>
      ) : erro ? (
        <p className="inscricoes-vazio">{erro}</p>
      ) : itensOrdenados.length === 0 ? (
        // RF10.10
        <p className="inscricoes-vazio">Você ainda não possui inscrições</p>
      ) : (
        <div className="inscricoes-lista">
          {itensOrdenados.map((item) => {
            // quebra "Quadra 2 — Campus Central" em duas linhas; se não tiver "—", mostra só uma
            const [localPrincipal, localComplemento] = item.local.split(' — ');

            return (
              <div key={item.chave} className="inscricao-card">
                <div className="inscricao-topo">
                  {/* RF10.5 */}
                  <strong>{item.nome}</strong>
                  {/* RF10.6 */}
                  <span className={`inscricao-status inscricao-status-${item.status}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>

                <div className="inscricao-info">
                  {/* RF10.7 */}
                  <span>📍 {localPrincipal}</span>
                  {localComplemento && <span className="inscricao-info-sub">{localComplemento}</span>}
                  {/* RF10.8 */}
                  <span>🕒 {item.horario}</span>
                </div>

                {/* RF10.9 */}
                <button type="button" className="inscricao-botao-detalhes" onClick={() => navigate(item.destino)}>
                  Ver detalhes
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MinhasInscricoes;
