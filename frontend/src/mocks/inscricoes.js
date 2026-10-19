// TODO: substituir por dado real vindo das tabelas inscricoes_esporte / inscricoes_evento quando o backend existir.
// Mock simples em memória — reseta ao recarregar a página, só serve pra simular o fluxo.

import { usuario } from './usuario';

// tipo: 'esporte' | 'evento'
// status esporte: 'em_analise' | 'confirmada' | 'cancelada'
// status evento: sempre 'confirmada' (cancelar remove o card da lista)
export const minhasInscricoes = [
  {
    id: 1,
    tipo: 'esporte',
    refId: 3,
    status: 'confirmada',
    criadoEm: '2026-09-20T10:00:00Z',
    alunoNome: usuario.nome,
    alunoMatricula: usuario.matricula,
  }, // Natação
  {
    id: 2,
    tipo: 'evento',
    refId: 1,
    status: 'confirmada',
    criadoEm: '2026-10-05T10:00:00Z',
    alunoNome: usuario.nome,
    alunoMatricula: usuario.matricula,
  }, // Torneio de Vôlei
  {
    id: 3,
    tipo: 'esporte',
    refId: 2,
    status: 'em_analise',
    criadoEm: '2026-10-12T09:00:00Z',
    alunoNome: 'Lucas Ferreira',
    alunoMatricula: '2314567',
  }, // Futsal, pendente — pra testar o RF23
  {
    id: 4,
    tipo: 'esporte',
    refId: 7,
    status: 'em_analise',
    criadoEm: '2026-10-13T15:30:00Z',
    alunoNome: 'Beatriz Lima',
    alunoMatricula: '2317891',
  }, // Atletismo, pendente — pra testar o RF23
];

export function jaInscritoEsporte(esporteId) {
  return minhasInscricoes.some((i) => i.tipo === 'esporte' && i.refId === esporteId && i.status !== 'cancelada');
}

export function registrarInscricaoEsporte(esporteId) {
  minhasInscricoes.push({
    id: minhasInscricoes.length + 1,
    tipo: 'esporte',
    refId: esporteId,
    status: 'em_analise',
    criadoEm: new Date().toISOString(),
    alunoNome: usuario.nome,
    alunoMatricula: usuario.matricula,
  });
}
