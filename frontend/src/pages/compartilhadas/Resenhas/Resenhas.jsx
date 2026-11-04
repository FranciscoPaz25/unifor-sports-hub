// Tela 12 — Avaliações (resenhas) do esporte (RF12). Aberta pelo "Ver todas as avaliações" da tela 08.
// Todos veem as aprovadas; o aluno com inscrição confirmada também avalia (tela 13).
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Estrelas from '../../../components/Estrelas/Estrelas';
import PopupResenha from '../../../popups/PopupResenha/PopupResenha';
import { chamarApi, mensagemDeErro } from '../../../utils/api';
import { formatarData } from '../../../utils/esportes';
import './Resenhas.css';

const statusLabel = {
  em_analise: 'Em análise',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
};

function Resenhas() {
  const { id } = useParams();
  const [dados, setDados] = useState(null);
  const [aviso, setAviso] = useState('Carregando…');
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [sucesso, setSucesso] = useState('');
  // Muda depois de enviar uma avaliação, para recarregar a lista
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await chamarApi(`/api/avaliacoes/esporte/${id}`);
        if (resposta.ok) {
          setDados(resposta.dados);
          setAviso('');
        } else {
          setAviso(mensagemDeErro(resposta.dados, 'Não foi possível carregar as avaliações.'));
        }
      } catch {
        setAviso('Não foi possível carregar as avaliações.');
      }
    }
    carregar();
  }, [id, versao]);

  if (!dados) {
    return (
      <div className="avaliacoes-container">
        <p className="avaliacoes-aviso">{aviso}</p>
        <Link to="/esportes" className="avaliacoes-link">Voltar para Esportes</Link>
      </div>
    );
  }

  const { esporte, avaliacoes, minhaAvaliacao, podeAvaliar } = dados;
  const notaTexto = esporte.totalAvaliacoes > 0 ? esporte.notaMedia.toFixed(1) : '—';

  // Quantas avaliações aprovadas têm cada nota, de 5 a 1
  const distribuicao = [5, 4, 3, 2, 1].map((n) => ({
    nota: n,
    total: avaliacoes.filter((a) => a.nota === n).length,
  }));

  function handleEnviada(mensagem) {
    setMostrarPopup(false);
    setSucesso(mensagem || 'Avaliação enviada.');
    setVersao((v) => v + 1);
  }

  return (
    <div className="avaliacoes-container">
      <div className="avaliacoes-topo">
        <Link to={`/esportes/${esporte.id}`} className="avaliacoes-voltar" aria-label="Voltar para o esporte">
          ←
        </Link>
        <h1>Avaliações de {esporte.nome}</h1>
      </div>

      <section className="avaliacoes-resumo">
        <div className="avaliacoes-media">
          <strong>{notaTexto}</strong>
          <Estrelas nota={esporte.notaMedia} />
          <span>
            {esporte.totalAvaliacoes} {esporte.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
          </span>
        </div>
        <ul className="avaliacoes-barras">
          {distribuicao.map((linha) => (
            <li key={linha.nota}>
              <span>{linha.nota} ★</span>
              <span className="avaliacoes-barra">
                <span
                  style={{ width: esporte.totalAvaliacoes ? `${(linha.total / esporte.totalAvaliacoes) * 100}%` : 0 }}
                />
              </span>
              <span className="avaliacoes-barra-total">{linha.total}</span>
            </li>
          ))}
        </ul>
      </section>

      {sucesso && <p className="avaliacoes-sucesso">{sucesso}</p>}

      {minhaAvaliacao ? (
        <section className="avaliacoes-minha">
          <div className="avaliacoes-minha-topo">
            <h2>Sua avaliação</h2>
            <span className={`avaliacoes-status avaliacoes-status-${minhaAvaliacao.status}`}>
              {statusLabel[minhaAvaliacao.status]}
            </span>
          </div>
          <Estrelas nota={minhaAvaliacao.nota} />
          {minhaAvaliacao.comentario && <p>{minhaAvaliacao.comentario}</p>}
          {podeAvaliar && (
            <button type="button" className="avaliacoes-botao-secundario" onClick={() => setMostrarPopup(true)}>
              Editar avaliação
            </button>
          )}
        </section>
      ) : podeAvaliar ? (
        <button type="button" className="avaliacoes-botao" onClick={() => setMostrarPopup(true)}>
          Avaliar este esporte
        </button>
      ) : null}

      <section className="avaliacoes-lista-secao">
        <h2>Todas as avaliações</h2>
        {avaliacoes.length === 0 ? (
          <p className="avaliacoes-vazio">Esta modalidade ainda não recebeu avaliações.</p>
        ) : (
          <div className="avaliacoes-lista">
            {avaliacoes.map((avaliacao) => (
              <article key={avaliacao.idAluno} className="avaliacoes-item">
                <div className="avaliacoes-item-topo">
                  <span className="avaliacoes-avatar">{avaliacao.nome.charAt(0).toUpperCase()}</span>
                  <div className="avaliacoes-autor">
                    <strong>{avaliacao.nome}</strong>
                    <span>{formatarData(avaliacao.criadoEm)}</span>
                  </div>
                  <Estrelas nota={avaliacao.nota} />
                </div>
                {avaliacao.comentario && <p>{avaliacao.comentario}</p>}
              </article>
            ))}
          </div>
        )}
      </section>

      {mostrarPopup && (
        <PopupResenha
          esporte={esporte}
          avaliacaoAtual={minhaAvaliacao}
          onEnviada={handleEnviada}
          onClose={() => setMostrarPopup(false)}
        />
      )}
    </div>
  );
}

export default Resenhas;
