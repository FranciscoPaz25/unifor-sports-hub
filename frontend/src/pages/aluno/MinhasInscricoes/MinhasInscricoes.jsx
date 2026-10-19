// Tela 10 — Minhas inscrições (RF10)
import { useNavigate } from 'react-router-dom';
import { esportes } from '../../../mocks/esportes';
import { eventos } from '../../../mocks/eventos';
import { minhasInscricoes } from '../../../mocks/inscricoes';
import './MinhasInscricoes.css';

const statusLabel = {
  em_analise: 'Em análise',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
};

function MinhasInscricoes() {
  const navigate = useNavigate();

  // RF10.4: ordenadas da mais recente para a mais antiga
  const inscricoesOrdenadas = [...minhasInscricoes].sort(
    (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
  );

  return (
    <div className="inscricoes-container">
      {/* RF10.3 */}
      <h1>Minhas inscrições</h1>

      {inscricoesOrdenadas.length === 0 ? (
        // RF10.10
        <p className="inscricoes-vazio">Você ainda não possui inscrições</p>
      ) : (
        <div className="inscricoes-lista">
          {inscricoesOrdenadas.map((inscricao) => {
            const ehEsporte = inscricao.tipo === 'esporte';
            const item = ehEsporte
              ? esportes.find((e) => e.id === inscricao.refId)
              : eventos.find((e) => e.id === inscricao.refId);

            if (!item) return null;

            // quebra "Quadra 2 — Campus Central" em duas linhas; se não tiver "—", mostra só uma
            const [localPrincipal, localComplemento] = item.local.split(' — ');

            function handleVerDetalhes() {
              // RF10.9
              if (ehEsporte) {
                navigate(`/minhas-inscricoes/${inscricao.id}`); // RF11
              } else {
                navigate(`/eventos/${item.id}`); // RF15 — ainda não existe
              }
            }

            return (
              <div key={inscricao.id} className="inscricao-card">
                <div className="inscricao-topo">
                  {/* RF10.5 */}
                  <strong>{item.nome}</strong>
                  {/* RF10.6 */}
                  <span className={`inscricao-status inscricao-status-${inscricao.status}`}>
                    {statusLabel[inscricao.status]}
                  </span>
                </div>

                <div className="inscricao-info">
                  {/* RF10.7 */}
                  <span>📍 {localPrincipal}</span>
                  {localComplemento && <span className="inscricao-info-sub">{localComplemento}</span>}
                  {ehEsporte ? (
                    // RF10.8
                    <span>🕒 {item.diasSemana} · {item.horarioInicio} às {item.horarioFim}</span>
                  ) : (
                    <span>🕒 {item.data} · {item.horario}</span>
                  )}
                </div>

                {/* RF10.9 */}
                <button type="button" className="inscricao-botao-detalhes" onClick={handleVerDetalhes}>
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
