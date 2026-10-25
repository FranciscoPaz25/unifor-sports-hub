// Tela 08 — Detalhes do esporte (RF08) — aluno vê "Inscrever-se", ADM vê "Excluir"
import { useEffect, useState } from 'react';
import { useParams, useOutletContext, useNavigate, Link } from 'react-router-dom';
import { chamarApi, mensagemDeErro } from '../../../utils/api';
import PopupInscricaoEsporte from '../../../popups/PopupInscricaoEsporte/PopupInscricaoEsporte';
import './DetalhesEsporte.css';

function Estrelas({ nota }) {
  const cheias = Math.round(nota);
  return (
    <span className="estrelas" aria-label={`${nota} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= cheias ? 'estrela cheia' : 'estrela'}>★</span>
      ))}
    </span>
  );
}

// Ícone genérico de bola (RF08.3 — imagem sempre genérica, nunca foto real)
function IconeBola({ tamanho = 26, cor = '#003DA5' }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M3.5 9h17M3.5 15h17" strokeLinecap="round" />
    </svg>
  );
}

const iconesInfo = {
  local: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.9">
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
  horario: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.9">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  dias: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.9">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  ),
  responsavel: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.9">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" strokeLinecap="round" />
    </svg>
  ),
  capacidade: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.9">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" strokeLinecap="round" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 13.8c2.1.8 3.5 3 3.5 6.2" strokeLinecap="round" />
    </svg>
  ),
};

function DetalhesEsporte() {
  const { id } = useParams();
  const { tipoUsuario } = useOutletContext();
  const navigate = useNavigate();
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [esporte, setEsporte] = useState(null);
  const [aviso, setAviso] = useState('Carregando…');
  const [erroExcluir, setErroExcluir] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    async function carregar() {
      setEsporte(null);
      setAviso('Carregando…');
      try {
        const { ok, dados } = await chamarApi(`/api/esportes/${id}`);
        if (ok) {
          setEsporte(dados.esporte);
          setAviso('');
        } else {
          setAviso(mensagemDeErro(dados, 'Não foi possível carregar o esporte.'));
        }
      } catch {
        setAviso('Não foi possível carregar o esporte.');
      }
    }
    carregar();
  }, [id]);

  if (!esporte) {
    return (
      <div className="detalhes-container">
        <p className="detalhes-nao-encontrado">{aviso}</p>
        <Link to="/esportes" className="detalhes-ver-todas">Voltar para Esportes</Link>
      </div>
    );
  }

  async function handleExcluir() {
    // RF08.17 — age direto, sem popup (decisoes.md)
    if (excluindo) return;
    setErroExcluir('');
    setExcluindo(true);
    try {
      const { ok, dados } = await chamarApi(`/api/esportes/${esporte.id}`, { metodo: 'DELETE' });
      if (!ok) {
        setErroExcluir(mensagemDeErro(dados, 'Não foi possível excluir o esporte.'));
        return;
      }
      navigate('/esportes');
    } catch {
      setErroExcluir('Não foi possível excluir o esporte.');
    } finally {
      setExcluindo(false);
    }
  }

  const temAvaliacoes = esporte.totalAvaliacoes > 0;
  const notaTexto = temAvaliacoes ? esporte.notaMedia.toFixed(1) : '—';

  // RF08.8 a RF08.12
  const informacoes = [
    { icone: 'local', rotulo: 'Local', valor: esporte.local },
    { icone: 'horario', rotulo: 'Horário', valor: `${esporte.horarioInicio} às ${esporte.horarioFim}` },
    { icone: 'dias', rotulo: 'Dia da semana', valor: esporte.diasSemana },
    { icone: 'responsavel', rotulo: 'Responsável/professor', valor: esporte.responsavel },
    { icone: 'capacidade', rotulo: 'Capacidade máxima de vagas', valor: `${esporte.capacidadeMaxima} vagas` },
  ];

  // RF08.15 — as duas mais recentes
  const avaliacoesRecentes = esporte.avaliacoes.slice(0, 2);

  return (
    <div className="detalhes-container">
      {/* RF08.3 */}
      <div
        className={esporte.imagem ? 'detalhes-capa detalhes-capa-imagem' : 'detalhes-capa'}
        style={esporte.imagem ? { backgroundImage: `url(${esporte.imagem})` } : undefined}
      >
        {!esporte.imagem && (
          <span className="detalhes-capa-fundo" aria-hidden="true">
            <IconeBola tamanho={150} cor="rgba(0, 61, 165, 0.1)" />
          </span>
        )}
        <span className="detalhes-capa-icone" aria-hidden="true">
          <IconeBola />
        </span>
        <h1>{esporte.nome}</h1>
      </div>

      <div className="detalhes-resumo">
        {/* RF08.4 */}
        <div className="detalhes-nota">
          <span className="estrela cheia">★</span>
          <strong>{notaTexto}</strong>
          <span>({esporte.totalAvaliacoes} avaliações)</span>
        </div>
        {/* RF08.5 */}
        <span className="detalhes-vagas">
          <i className="detalhes-vagas-ponto" />
          {esporte.vagas} vagas disponíveis
        </span>
      </div>

      {/* RF08.6 */}
      <section className="detalhes-secao">
        <h2>Descrição</h2>
        <p>{esporte.descricao}</p>
      </section>

      {/* RF08.7 */}
      <section className="detalhes-secao">
        <h2>Informações</h2>
        <ul className="detalhes-informacoes">
          {informacoes.map((info) => (
            <li key={info.rotulo}>
              <span className="detalhes-info-icone" aria-hidden="true">{iconesInfo[info.icone]}</span>
              <strong>{info.rotulo}:</strong>
              <span>{info.valor}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* RF08.13 / RF08.17 */}
      {tipoUsuario === 'admin' ? (
        <>
          <button
            type="button"
            className="detalhes-botao detalhes-botao-excluir"
            onClick={handleExcluir}
            disabled={excluindo}
          >
            {excluindo ? 'Excluindo…' : 'Excluir'}
          </button>
          {erroExcluir && <p className="detalhes-erro">{erroExcluir}</p>}
        </>
      ) : (
        <button type="button" className="detalhes-botao" onClick={() => setMostrarPopup(true)}>
          Inscrever-se
        </button>
      )}

      <section className="detalhes-secao">
        <h2>Avaliações</h2>

        {/* RF08.14 */}
        <div className="detalhes-avaliacoes-resumo">
          <strong>{notaTexto}</strong>
          <div>
            <Estrelas nota={esporte.notaMedia ?? 0} />
            <span>Baseado em {esporte.totalAvaliacoes} avaliações</span>
          </div>
        </div>

        {avaliacoesRecentes.length === 0 ? (
          <p className="detalhes-sem-avaliacoes">Esta modalidade ainda não recebeu avaliações.</p>
        ) : (
          <div className="detalhes-avaliacoes-lista">
            {avaliacoesRecentes.map((avaliacao, i) => (
              <div key={i} className="detalhes-avaliacao-item">
                <div className="detalhes-avaliacao-topo">
                  <span className="detalhes-avaliacao-avatar">{avaliacao.nome.charAt(0)}</span>
                  <strong>{avaliacao.nome}</strong>
                  <Estrelas nota={avaliacao.nota} />
                </div>
                <p>{avaliacao.comentario}</p>
              </div>
            ))}
          </div>
        )}

        {/* RF08.16 */}
        <Link to={`/esportes/${esporte.id}/resenhas`} className="detalhes-ver-todas">
          Ver todas as avaliações →
        </Link>
      </section>

      {mostrarPopup && (
        <PopupInscricaoEsporte esporte={esporte} onClose={() => setMostrarPopup(false)} />
      )}
    </div>
  );
}

export default DetalhesEsporte;
