import { useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { esportes } from '../../mocks/esportes';
import PopupInscricaoEsporte from '../../components/PopupInscricaoEsporte/PopupInscricaoEsporte';
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

function DetalhesEsporte() {
  const { id } = useParams();
  const { tipoUsuario } = useOutletContext();
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const esporte = esportes.find((e) => e.id === Number(id));

  if (!esporte) {
    return (
      <div className="detalhes-container">
        <p>Esporte não encontrado.</p>
      </div>
    );
  }

  function handleExcluir() {
    // TODO: chamar DELETE /esportes/:id quando a rota real existir
  }

  return (
    <div className="detalhes-container">
      <div className="detalhes-capa">
        <h1>{esporte.nome}</h1>
      </div>

      <div className="detalhes-corpo">
        <div className="detalhes-resumo">
          <div className="detalhes-nota">
            <Estrelas nota={esporte.notaMedia} />
            <span>{esporte.notaMedia.toFixed(1)} ({esporte.totalAvaliacoes} avaliações)</span>
          </div>
          <span className="detalhes-vagas">{esporte.vagas} vagas disponíveis</span>
        </div>

        <section className="detalhes-secao">
          <h2>Descrição</h2>
          <p>{esporte.descricao}</p>
        </section>

        <section className="detalhes-secao">
          <h2>Informações</h2>
          <ul className="detalhes-informacoes">
            <li>📍 {esporte.local}</li>
            <li>🕒 {esporte.horarioInicio} às {esporte.horarioFim}</li>
            <li>📅 {esporte.diasSemana}</li>
            <li>🧑‍🏫 {esporte.responsavel}</li>
            <li>👥 Capacidade máxima: {esporte.capacidadeMaxima} vagas</li>
          </ul>
        </section>

        {tipoUsuario === 'admin' ? (
          <button type="button" className="detalhes-botao detalhes-botao-excluir" onClick={handleExcluir}>
            Excluir
          </button>
        ) : (
          <button type="button" className="detalhes-botao" onClick={() => setMostrarPopup(true)}>
            Inscrever-se
          </button>
        )}

        <section className="detalhes-secao">
          <h2>Avaliações</h2>
          <div className="detalhes-avaliacoes-resumo">
            <strong>{esporte.notaMedia.toFixed(1)}</strong>
            <Estrelas nota={esporte.notaMedia} />
            <span>Baseado em {esporte.totalAvaliacoes} avaliações</span>
          </div>

          <div className="detalhes-avaliacoes-lista">
            {esporte.avaliacoes.map((avaliacao, i) => (
              <div key={i} className="detalhes-avaliacao-item">
                <div className="detalhes-avaliacao-topo">
                  <strong>{avaliacao.nome}</strong>
                  <Estrelas nota={avaliacao.nota} />
                </div>
                <p>{avaliacao.comentario}</p>
              </div>
            ))}
          </div>

          <Link to={`/esportes/${esporte.id}/resenhas`} className="detalhes-ver-todas">
            Ver todas as avaliações
          </Link>
        </section>
      </div>

      {mostrarPopup && (
        <PopupInscricaoEsporte esporte={esporte} onClose={() => setMostrarPopup(false)} />
      )}
    </div>
  );
}

export default DetalhesEsporte;
