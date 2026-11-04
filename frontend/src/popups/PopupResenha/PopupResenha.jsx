// Tela 13 — Popup de enviar resenha (RF13). Enviar de novo substitui a avaliação anterior.
import { useState } from 'react';
import { chamarApi, mensagemDeErro } from '../../utils/api';
import './PopupResenha.css';

const LIMITE_COMENTARIO = 255;
const ROTULOS_NOTA = ['', 'Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

function PopupResenha({ esporte, avaliacaoAtual, onEnviada, onClose }) {
  const [nota, setNota] = useState(avaliacaoAtual?.nota ?? 0);
  const [notaEmFoco, setNotaEmFoco] = useState(0);
  const [comentario, setComentario] = useState(avaliacaoAtual?.comentario ?? '');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const notaMostrada = notaEmFoco || nota;

  async function handleEnviar() {
    if (enviando) return;
    if (nota < 1) {
      setErro('Escolha uma nota de 1 a 5 estrelas.');
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      const { ok, dados } = await chamarApi(`/api/avaliacoes/esporte/${esporte.id}`, {
        metodo: 'PUT',
        corpo: { nota, comentario },
      });
      if (!ok) {
        setErro(mensagemDeErro(dados, 'Não foi possível enviar a avaliação.'));
        return;
      }
      onEnviada(dados.avaliacao);
    } catch {
      setErro('Não foi possível enviar a avaliação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="resenha-overlay" onClick={onClose}>
      <div className="resenha-card" onClick={(e) => e.stopPropagation()}>
        <div className="resenha-topo">
          <h2>{avaliacaoAtual ? 'Editar avaliação' : 'Avaliar esporte'}</h2>
          <button type="button" className="resenha-fechar" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <p className="resenha-esporte">{esporte.nome}</p>

        <div className="resenha-nota">
          <div className="resenha-estrelas" onMouseLeave={() => setNotaEmFoco(0)}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                className={i <= notaMostrada ? 'resenha-estrela cheia' : 'resenha-estrela'}
                onClick={() => setNota(i)}
                onMouseEnter={() => setNotaEmFoco(i)}
                aria-label={`${i} ${i === 1 ? 'estrela' : 'estrelas'}`}
                aria-pressed={i === nota}
              >
                ★
              </button>
            ))}
          </div>
          <span className="resenha-nota-rotulo">{ROTULOS_NOTA[notaMostrada] || 'Escolha uma nota'}</span>
        </div>

        <label className="resenha-comentario">
          Comentário (opcional)
          <textarea
            rows={4}
            maxLength={LIMITE_COMENTARIO}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Conte como foi sua experiência com a modalidade..."
          />
          <span className="resenha-contador">{comentario.length}/{LIMITE_COMENTARIO}</span>
        </label>

        <p className="resenha-aviso">A avaliação aparece para todos depois que o administrador aprovar.</p>

        {erro && <p className="resenha-erro">{erro}</p>}

        <div className="resenha-botoes">
          <button type="button" className="resenha-botao-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="resenha-botao-enviar" onClick={handleEnviar} disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar avaliação'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupResenha;
