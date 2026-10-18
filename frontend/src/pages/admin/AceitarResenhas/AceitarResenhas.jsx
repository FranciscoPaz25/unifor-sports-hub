// Tela 21 — Aceitar resenhas (RF21)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { esportes } from '../../../mocks/esportes';
import { resenhasPendentes } from '../../../mocks/resenhas';
import './AceitarResenhas.css';

function Estrelas({ nota }) {
  return (
    <span className="resenhas-estrelas" aria-label={`${nota} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= nota ? 'resenhas-estrela cheia' : 'resenhas-estrela'}>★</span>
      ))}
    </span>
  );
}

function removerDaFila(resenha) {
  const indice = resenhasPendentes.findIndex((r) => r.id === resenha.id);
  if (indice !== -1) resenhasPendentes.splice(indice, 1);
}

function AceitarResenhas() {
  const [pendentes, setPendentes] = useState(() => [...resenhasPendentes]);

  function aceitar(resenha) {
    // RF21.6 — TODO: substituir por PATCH /avaliacoes/:id quando o backend existir
    const esporte = esportes.find((e) => e.id === resenha.esporteId);
    if (esporte) {
      esporte.avaliacoes.unshift({ nome: resenha.alunoNome, nota: resenha.nota, comentario: resenha.comentario });
      const somaAnterior = esporte.notaMedia * esporte.totalAvaliacoes;
      esporte.totalAvaliacoes += 1;
      esporte.notaMedia = (somaAnterior + resenha.nota) / esporte.totalAvaliacoes;
    }
    removerDaFila(resenha);
    setPendentes((atual) => atual.filter((r) => r.id !== resenha.id));
  }

  function rejeitar(resenha) {
    // RF21.5 — TODO: substituir por PATCH /avaliacoes/:id quando o backend existir
    removerDaFila(resenha);
    setPendentes((atual) => atual.filter((r) => r.id !== resenha.id));
  }

  return (
    <div className="resenhas-container">
      <div className="resenhas-topo">
        <Link to="/admin/gerencia" className="resenhas-voltar" aria-label="Voltar para Gerência">
          ←
        </Link>
        <h1>Aceitar resenhas</h1>
      </div>

      {pendentes.length === 0 ? (
        // RF21.7
        <p className="resenhas-vazio">Não há avaliações pendentes de moderação.</p>
      ) : (
        <div className="resenhas-lista">
          {pendentes.map((resenha) => {
            const esporte = esportes.find((e) => e.id === resenha.esporteId);

            return (
              <div key={resenha.id} className="resenhas-card">
                <div className="resenhas-card-topo">
                  <div className="resenhas-autor">
                    <strong>{resenha.alunoNome}</strong>
                    {esporte && <span className="resenhas-tag">{esporte.nome}</span>}
                  </div>
                  <Estrelas nota={resenha.nota} />
                </div>

                <p className="resenhas-comentario">{resenha.comentario}</p>

                <div className="resenhas-botoes">
                  <button type="button" className="resenhas-botao-rejeitar" onClick={() => rejeitar(resenha)}>
                    Rejeitar
                  </button>
                  <button type="button" className="resenhas-botao-aceitar" onClick={() => aceitar(resenha)}>
                    Aceitar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AceitarResenhas;
