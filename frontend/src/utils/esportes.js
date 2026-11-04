// Categorias de esporte: usadas em Criar esporte (tela 20) e no Popup de filtros (tela 07)
export const CATEGORIAS = ['Coletivo', 'Individual', 'Luta', 'Aquático', 'Atletismo'];

// Ícones padrão dos esportes, escolhidos em Criar esporte. Os nomes precisam bater com
// ICONES em backend/modules/esportes/esporte.validacao.cjs; os desenhos ficam em IconeEsporte.
export const ICONES_ESPORTE = [
  { nome: 'geral', rotulo: 'Geral' },
  { nome: 'futebol', rotulo: 'Futebol' },
  { nome: 'volei', rotulo: 'Vôlei' },
  { nome: 'basquete', rotulo: 'Basquete' },
  { nome: 'natacao', rotulo: 'Natação' },
  { nome: 'tenis', rotulo: 'Tênis' },
  { nome: 'atletismo', rotulo: 'Atletismo' },
  { nome: 'luta', rotulo: 'Lutas' },
  { nome: 'ciclismo', rotulo: 'Ciclismo' },
  { nome: 'academia', rotulo: 'Academia' },
];

// "2026-11-04T..." -> "04/11/2026"
export function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR');
}
