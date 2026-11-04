// Tela 06 — Resultados de busca (RF06). Termo e categoria vêm da URL (?termo=&categoria=).
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BarraBusca from '../../../components/BarraBusca/BarraBusca';
import Card from '../../../components/Card/Card';
import { chamarApi, mensagemDeErro } from '../../../utils/api';
import './ResultadosBusca.css';

function ResultadosBusca() {
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const termo = parametros.get('termo') ?? '';
  const categoria = parametros.get('categoria') ?? '';

  const [esportes, setEsportes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const busca = new URLSearchParams();
        if (termo) busca.set('busca', termo);
        if (categoria) busca.set('categoria', categoria);
        const { ok, dados } = await chamarApi(`/api/esportes?${busca}`);
        if (ok) setEsportes(dados.esportes);
        else setErro(mensagemDeErro(dados, 'Não foi possível buscar os esportes.'));
      } catch {
        setErro('Não foi possível buscar os esportes.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [termo, categoria]);

  // Remove um filtro e mantém o outro
  function remover(chave) {
    const novos = new URLSearchParams(parametros);
    novos.delete(chave);
    const query = novos.toString();
    navigate(query ? `/esportes/busca?${query}` : '/esportes/busca');
  }

  const total = esportes.length;

  return (
    <div className="busca-container">
      <h1>Resultados da busca</h1>

      {/* key: recria a barra quando a URL muda, para o campo mostrar o termo atual */}
      <BarraBusca key={`${termo}|${categoria}`} termoInicial={termo} categoriaInicial={categoria} />

      {(termo || categoria) && (
        <div className="busca-filtros-ativos">
          {termo && (
            <span className="busca-chip">
              “{termo}”
              <button type="button" onClick={() => remover('termo')} aria-label="Remover termo da busca">✕</button>
            </span>
          )}
          {categoria && (
            <span className="busca-chip">
              {categoria}
              <button type="button" onClick={() => remover('categoria')} aria-label="Remover filtro de categoria">✕</button>
            </span>
          )}
        </div>
      )}

      {carregando ? (
        <p className="busca-aviso">Buscando…</p>
      ) : erro ? (
        <p className="busca-aviso">{erro}</p>
      ) : total === 0 ? (
        <div className="busca-vazio">
          <strong>Nenhum esporte encontrado.</strong>
          <span>Tente outro termo ou remova os filtros.</span>
        </div>
      ) : (
        <>
          <p className="busca-total">
            {total} {total === 1 ? 'esporte encontrado' : 'esportes encontrados'}
          </p>
          <div className="busca-grid">
            {esportes.map((esporte) => (
              <Card
                key={esporte.id}
                nome={esporte.nome}
                local={esporte.local}
                vagas={esporte.vagas}
                icone={esporte.icone}
                horario={`${esporte.diasSemana} · ${esporte.horarioInicio} às ${esporte.horarioFim}`}
                nota={esporte.notaMedia}
                onVerDetalhes={() => navigate(`/esportes/${esporte.id}`)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ResultadosBusca;
