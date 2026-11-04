// Tela 21 — Aceitar resenhas (RF21)
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Estrelas from '../../../components/Estrelas/Estrelas';
import { chamarApi, mensagemDeErro } from '../../../utils/api';
import { formatarData } from '../../../utils/esportes';
import './AceitarResenhas.css';

// Cada aluno tem uma avaliação por esporte: os dois ids identificam a avaliação
const chave = (resenha) => `${resenha.idEsporte}-${resenha.idAluno}`;

function AceitarResenhas() {
  const [pendentes, setPendentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [decidindo, setDecidindo] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const { ok, dados } = await chamarApi('/api/avaliacoes/pendentes');
        if (ok) setPendentes(dados.avaliacoes);
        else setErro(mensagemDeErro(dados, 'Não foi possível carregar as avaliações.'));
      } catch {
        setErro('Não foi possível carregar as avaliações.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // RF21.5 / RF21.6 — Rejeitar (rejeitada) ou Aceitar (aprovada); o card sai da lista
  async function decidir(resenha, status) {
    if (decidindo) return;
    setErro('');
    setDecidindo(chave(resenha));
    try {
      const { ok, dados } = await chamarApi(`/api/avaliacoes/${resenha.idEsporte}/${resenha.idAluno}`, {
        metodo: 'PATCH',
        corpo: { status },
      });
      // 409: outro admin já analisou; tira da lista do mesmo jeito
      if (ok || dados?.mensagem === 'Esta avaliação já foi analisada.') {
        setPendentes((atual) => atual.filter((r) => chave(r) !== chave(resenha)));
      }
      if (!ok) setErro(mensagemDeErro(dados, 'Não foi possível salvar a decisão.'));
    } catch {
      setErro('Não foi possível salvar a decisão.');
    } finally {
      setDecidindo(null);
    }
  }

  return (
    <div className="resenhas-container">
      <div className="resenhas-topo">
        <Link to="/admin/gerencia" className="resenhas-voltar" aria-label="Voltar para Gerência">
          ←
        </Link>
        <h1>Aceitar resenhas</h1>
      </div>

      {erro && <p className="resenhas-erro">{erro}</p>}

      {carregando ? (
        <p className="resenhas-vazio">Carregando avaliações…</p>
      ) : pendentes.length === 0 ? (
        // RF21.7
        <p className="resenhas-vazio">Não há avaliações pendentes de moderação.</p>
      ) : (
        <div className="resenhas-lista">
          {pendentes.map((resenha) => (
            <div key={chave(resenha)} className="resenhas-card">
              <div className="resenhas-card-topo">
                <div className="resenhas-autor">
                  <strong>{resenha.nome}</strong>
                  <span className="resenhas-tag">{resenha.esporte}</span>
                  <span className="resenhas-data">{formatarData(resenha.criadoEm)}</span>
                </div>
                <Estrelas nota={resenha.nota} />
              </div>

              <p className="resenhas-comentario">
                {resenha.comentario || <em>Sem comentário, só a nota.</em>}
              </p>

              <div className="resenhas-botoes">
                <button
                  type="button"
                  className="resenhas-botao-rejeitar"
                  onClick={() => decidir(resenha, 'rejeitada')}
                  disabled={decidindo !== null}
                >
                  Rejeitar
                </button>
                <button
                  type="button"
                  className="resenhas-botao-aceitar"
                  onClick={() => decidir(resenha, 'aprovada')}
                  disabled={decidindo !== null}
                >
                  {decidindo === chave(resenha) ? 'Salvando…' : 'Aceitar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AceitarResenhas;
