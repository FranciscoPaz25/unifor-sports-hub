// Tela 24 — Ajuda (RF24)
// Guia de uso do app. Compartilhada: o conteúdo muda conforme o perfil (aluno ou admin).
import { Link, useOutletContext } from 'react-router-dom';
import './Ajuda.css';

const PASSOS_ALUNO = [
  {
    titulo: 'Encontre um esporte',
    texto:
      'Abra "Esportes" na barra azul do topo. Use a busca para procurar pelo nome ou o botão de filtros para escolher categorias.',
    link: { para: '/esportes', rotulo: 'Ver esportes' },
  },
  {
    titulo: 'Peça sua inscrição',
    texto:
      'Em "Ver detalhes", confira local, horário e vagas. Clique em "Inscrever-se" e confirme no popup.',
  },
  {
    titulo: 'Aguarde a análise',
    texto:
      'Todo pedido começa "Em análise". A administração do esporte aceita ou rejeita o pedido.',
  },
  {
    titulo: 'Acompanhe o status',
    texto:
      'Em "Minhas inscrições" você vê a situação de cada pedido e pode cancelar quando quiser.',
    link: { para: '/minhas-inscricoes', rotulo: 'Minhas inscrições' },
  },
  {
    titulo: 'Avalie o esporte',
    texto:
      'Com a inscrição confirmada, abra as avaliações do esporte e deixe sua nota de 1 a 5 estrelas, com ou sem comentário.',
  },
];

const PASSOS_ADMIN = [
  {
    titulo: 'Cadastre os esportes',
    texto:
      'Em "Gerência" → "Criar esportes", preencha nome, categoria, local, horários, capacidade e escolha um ícone.',
    link: { para: '/admin/gerencia/criar-esporte', rotulo: 'Criar esporte' },
  },
  {
    titulo: 'Decida as inscrições',
    texto:
      'Em "Gerência" → "Aceitar esportes", aceite ou rejeite os pedidos. Só é possível aceitar se ainda houver vaga.',
    link: { para: '/admin/gerencia/inscricoes', rotulo: 'Gerenciar inscrições' },
  },
  {
    titulo: 'Modere as resenhas',
    texto:
      'Avaliações com comentário só aparecem depois de aprovadas em "Gerência" → "Aceitar resenhas".',
    link: { para: '/admin/gerencia/resenhas', rotulo: 'Aceitar resenhas' },
  },
  {
    titulo: 'Mantenha o catálogo em dia',
    texto:
      'Em "Esportes" → "Ver detalhes", use "Editar" para mudar as informações ou "Excluir" para retirar o esporte.',
    link: { para: '/esportes', rotulo: 'Ver esportes' },
  },
];

const STATUS_INSCRICAO = [
  { classe: 'analise', nome: 'Em análise', texto: 'Pedido enviado, aguardando a administração.' },
  { classe: 'confirmada', nome: 'Confirmada', texto: 'Você tem a vaga. Já pode avaliar o esporte.' },
  { classe: 'rejeitada', nome: 'Rejeitada', texto: 'O pedido não foi aceito. Você pode pedir de novo.' },
  { classe: 'cancelada', nome: 'Cancelada', texto: 'Você cancelou. Também pode pedir de novo.' },
];

const PERGUNTAS_ALUNO = [
  {
    pergunta: 'Por que não consigo me inscrever?',
    resposta:
      'O esporte pode estar sem vagas ("0 vagas disponíveis") ou você já tem um pedido em análise ou confirmado nele.',
  },
  {
    pergunta: 'Por que minha avaliação não aparece?',
    resposta:
      'Avaliações só com estrelas aparecem na hora. Com comentário, elas ficam "Em análise" até a administração aprovar.',
  },
  {
    pergunta: 'Como mudo meu nome, e-mail ou senha?',
    resposta:
      'Em "Configurações". A senha nova precisa ter de 15 a 128 caracteres.',
  },
  {
    pergunta: 'Por que voltei para a tela de login?',
    resposta:
      'Por segurança, a sessão termina depois de 15 minutos sem uso. É só entrar de novo.',
  },
];

const PERGUNTAS_ADMIN = [
  {
    pergunta: 'Por que não consigo aceitar uma inscrição?',
    resposta:
      'O esporte já está com todas as vagas ocupadas. Aumente a capacidade em "Editar" ou recuse o pedido.',
  },
  {
    pergunta: 'O que acontece ao excluir um esporte?',
    resposta:
      'Ele sai do catálogo na hora, sem popup de confirmação. Confira antes de clicar em "Excluir".',
  },
  {
    pergunta: 'Quais avaliações passam por mim?',
    resposta:
      'Só as que têm comentário. As que têm apenas estrelas são publicadas direto.',
  },
  {
    pergunta: 'Por que voltei para a tela de login?',
    resposta:
      'Por segurança, a sessão termina depois de 15 minutos sem uso. É só entrar de novo.',
  },
];

function Ajuda() {
  const { tipoUsuario } = useOutletContext();
  const ehAdmin = tipoUsuario === 'admin';
  const passos = ehAdmin ? PASSOS_ADMIN : PASSOS_ALUNO;
  const perguntas = ehAdmin ? PERGUNTAS_ADMIN : PERGUNTAS_ALUNO;

  return (
    <div className="ajuda-container">
      <header className="ajuda-cabecalho">
        <h1>Ajuda</h1>
        <p>
          {ehAdmin
            ? 'Guia rápido para administrar os esportes, as inscrições e as resenhas.'
            : 'Guia rápido para encontrar um esporte, se inscrever e acompanhar seus pedidos.'}
        </p>
      </header>

      <section className="ajuda-secao">
        <h2>Passo a passo</h2>
        <ol className="ajuda-passos">
          {passos.map((passo, i) => (
            <li key={passo.titulo} className="ajuda-passo">
              <span className="ajuda-passo-numero">{i + 1}</span>
              <div className="ajuda-passo-texto">
                <h3>{passo.titulo}</h3>
                <p>{passo.texto}</p>
                {passo.link && (
                  <Link to={passo.link.para} className="ajuda-passo-link">
                    {passo.link.rotulo} →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="ajuda-secao">
        <h2>O que cada status quer dizer</h2>
        <ul className="ajuda-status">
          {STATUS_INSCRICAO.map((s) => (
            <li key={s.classe}>
              <span className={`ajuda-tag ajuda-tag-${s.classe}`}>{s.nome}</span>
              <span>{s.texto}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ajuda-secao">
        <h2>Perguntas frequentes</h2>
        <div className="ajuda-perguntas">
          {perguntas.map((p) => (
            <details key={p.pergunta} className="ajuda-pergunta">
              <summary>{p.pergunta}</summary>
              <p>{p.resposta}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Ajuda;
