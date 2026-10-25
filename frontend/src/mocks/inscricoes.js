// Inscrições em EVENTOS ainda são mock (módulo de eventos fora do MVP essencial).
// Inscrições em esportes vêm da API: /api/inscricoes-esporte.
// Mock simples em memória — reseta ao recarregar a página.

// refId = id do evento em mocks/eventos.js. Status de evento: sempre 'confirmada'.
export const inscricoesEventos = [
  {
    id: 1,
    refId: 1,
    status: 'confirmada',
    criadoEm: '2026-10-05T10:00:00Z',
  }, // Torneio de Vôlei
];
