import { useState } from 'react';
import { Link } from 'react-router-dom';
import { esportes } from '../../mocks/esportes';
import { minhasInscricoes } from '../../mocks/inscricoes';
import './GerenciarInscricoes.css';

function pendentesAtuais() {
  return minhasInscricoes.filter((i) => i.tipo === 'esporte' && i.status === 'em_analise');
}

function GerenciarInscricoes() {
  const [pendentes, setPendentes] = useState(pendentesAtuais);

  function decidir(inscricao, novoStatus) {
    // RF23.6 / RF23.7 — TODO: substituir por PATCH /inscricoes-esporte/:id quando o backend existir
    inscricao.status = novoStatus;

    // RF23.8
    setPendentes((atual) => atual.filter((i) => i.id !== inscricao.id));
  }

  return (
    <div className="gerenciar-container">
      <div className="gerenciar-topo">
        <Link to="/admin/gerencia" className="gerenciar-voltar" aria-label="Voltar para Gerência">
          ←
        </Link>
        <h1>Gerenciar inscrições</h1>
      </div>

      {pendentes.length === 0 ? (
        // RF23.9
        <p className="gerenciar-vazio">Não há inscrições pendentes de análise.</p>
      ) : (
        <div className="gerenciar-lista">
          {pendentes.map((inscricao) => {
            const esporte = esportes.find((e) => e.id === inscricao.refId);
            if (!esporte) return null;

            return (
              <div key={inscricao.id} className="gerenciar-card">
                <div className="gerenciar-card-topo">
                  <div>
                    <strong>{inscricao.alunoNome}</strong>
                    <span className="gerenciar-matricula">Matrícula: {inscricao.alunoMatricula}</span>
                  </div>
                  <span className="gerenciar-tag">Em análise</span>
                </div>

                <div className="gerenciar-card-info">
                  <span>{esporte.nome}</span>
                  <span>{esporte.diasSemana} · {esporte.horarioInicio} às {esporte.horarioFim}</span>
                </div>

                <div className="gerenciar-botoes">
                  <button
                    type="button"
                    className="gerenciar-botao-rejeitar"
                    onClick={() => decidir(inscricao, 'cancelada')}
                  >
                    Rejeitar
                  </button>
                  <button
                    type="button"
                    className="gerenciar-botao-aceitar"
                    onClick={() => decidir(inscricao, 'confirmada')}
                  >
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

export default GerenciarInscricoes;
