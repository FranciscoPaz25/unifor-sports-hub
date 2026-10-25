// Tela 23 — Gerenciar inscrições (RF23)
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { chamarApi, mensagemDeErro } from '../../../utils/api';
import './GerenciarInscricoes.css';

function GerenciarInscricoes() {
  const [pendentes, setPendentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [decidindo, setDecidindo] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const { ok, dados } = await chamarApi('/api/inscricoes-esporte/pendentes');
        if (ok) setPendentes(dados.inscricoes);
        else setErro(mensagemDeErro(dados, 'Não foi possível carregar as inscrições.'));
      } catch {
        setErro('Não foi possível carregar as inscrições.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // RF23.6 / RF23.7 — novoStatus: 'confirmada' (Aceitar) ou 'rejeitada' (Rejeitar)
  async function decidir(inscricao, novoStatus) {
    if (decidindo) return;
    setErro('');
    setDecidindo(inscricao.id);
    try {
      const { ok, dados } = await chamarApi(`/api/inscricoes-esporte/${inscricao.id}`, {
        metodo: 'PATCH',
        corpo: { status: novoStatus },
      });
      if (!ok) {
        setErro(mensagemDeErro(dados, 'Não foi possível atualizar a inscrição.'));
        return;
      }
      // RF23.8 — o card sai da lista
      setPendentes((atual) => atual.filter((i) => i.id !== inscricao.id));
    } catch {
      setErro('Não foi possível atualizar a inscrição.');
    } finally {
      setDecidindo(null);
    }
  }

  return (
    <div className="gerenciar-container">
      <div className="gerenciar-topo">
        <Link to="/admin/gerencia" className="gerenciar-voltar" aria-label="Voltar para Gerência">
          ←
        </Link>
        <h1>Gerenciar inscrições</h1>
      </div>

      {erro && <p className="gerenciar-erro">{erro}</p>}

      {carregando ? (
        <p className="gerenciar-vazio">Carregando inscrições…</p>
      ) : pendentes.length === 0 ? (
        // RF23.9
        <p className="gerenciar-vazio">Não há inscrições pendentes de análise.</p>
      ) : (
        <div className="gerenciar-lista">
          {pendentes.map((inscricao) => {
            const esporte = inscricao.esporte;

            return (
              <div key={inscricao.id} className="gerenciar-card">
                <div className="gerenciar-card-info">
                  <div className="gerenciar-aluno">
                    <strong>{inscricao.aluno.nome}</strong>
                    <span className="gerenciar-tag">Em análise</span>
                  </div>
                  <span className="gerenciar-matricula">Matrícula: {inscricao.aluno.matricula}</span>
                  <span className="gerenciar-modalidade">{esporte.nome}</span>
                  <span className="gerenciar-horario">
                    {esporte.diasSemana} • {esporte.horarioInicio} às {esporte.horarioFim}
                  </span>
                </div>

                <div className="gerenciar-botoes">
                  <button
                    type="button"
                    className="gerenciar-botao-rejeitar"
                    onClick={() => decidir(inscricao, 'rejeitada')}
                    disabled={decidindo === inscricao.id}
                  >
                    Rejeitar
                  </button>
                  <button
                    type="button"
                    className="gerenciar-botao-aceitar"
                    onClick={() => decidir(inscricao, 'confirmada')}
                    disabled={decidindo === inscricao.id}
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
