// Home do admin — sem número próprio no mapa de telas (specs/status.md)
import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { chamarApi, mensagemDeErro } from '../../../utils/api';
import './HomeAdmin.css';

const ERRO_RESUMO = 'Não foi possível carregar o resumo.';

const atalhos = [
  { titulo: 'Gerenciar inscrições', link: '/admin/gerencia/inscricoes' },
  { titulo: 'Criar esporte', link: '/admin/gerencia/criar-esporte' },
  { titulo: 'Ver esportes', link: '/esportes' },
];

function HomeAdmin() {
  const { usuario } = useOutletContext();
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const [pendentes, esportes] = await Promise.all([
          chamarApi('/api/inscricoes-esporte/pendentes'),
          chamarApi('/api/esportes'),
        ]);
        const falha = [pendentes, esportes].find((resposta) => !resposta.ok);
        if (falha) {
          setErro(mensagemDeErro(falha.dados, ERRO_RESUMO));
          return;
        }
        setResumo({
          pendentes: pendentes.dados.inscricoes.length,
          esportes: esportes.dados.esportes.length,
        });
      } catch {
        setErro(ERRO_RESUMO);
      }
    }
    carregar();
  }, []);

  const indicadores = [
    { rotulo: 'Inscrições pendentes', valor: resumo?.pendentes, link: '/admin/gerencia/inscricoes' },
    { rotulo: 'Esportes cadastrados', valor: resumo?.esportes, link: '/esportes' },
  ];

  return (
    <div className="home-admin-container">
      <h1>Olá, {usuario.Nome.split(' ')[0]}!</h1>

      {erro && <p className="home-admin-erro">{erro}</p>}

      <section className="home-admin-secao">
        <h2>Resumo</h2>
        <div className="home-admin-indicadores">
          {indicadores.map((indicador) => (
            <Link key={indicador.rotulo} to={indicador.link} className="home-admin-indicador">
              <strong>{indicador.valor ?? '—'}</strong>
              <span>{indicador.rotulo}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-admin-secao">
        <h2>Atalhos</h2>
        <div className="home-admin-atalhos">
          {atalhos.map((atalho) => (
            <Link key={atalho.titulo} to={atalho.link} className="home-admin-atalho">
              {atalho.titulo}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomeAdmin;
