// TODO: substituir por dado real vindo da tabela avaliacoes (status pendente) quando o backend existir.
// Mock simples em memória — reseta ao recarregar a página, só serve pra simular o fluxo do RF21.

// esporteId referencia mocks/esportes.js
export const resenhasPendentes = [
  {
    id: 1,
    esporteId: 1,
    alunoNome: 'Mariana Costa',
    nota: 5,
    comentario: 'Excelente infraestrutura no ginásio e o professor é muito atencioso com os iniciantes. Os treinos têm sido muito produtivos!',
  }, // Vôlei
  {
    id: 2,
    esporteId: 3,
    alunoNome: 'Lucas Ferreira',
    nota: 5,
    comentario: 'A piscina olímpica está muito bem cuidada e a temperatura da água é ideal. Recomendo muito para quem quer treinar sério.',
  }, // Natação
  {
    id: 3,
    esporteId: 4,
    alunoNome: 'Beatriz Lima',
    nota: 4,
    comentario: 'Os treinos de basquete são muito dinâmicos. A quadra tem ótima aderência e o material disponível é de qualidade.',
  }, // Basquete
  {
    id: 4,
    esporteId: 2,
    alunoNome: 'Rafael Albuquerque',
    nota: 5,
    comentario: 'Ótima experiência na integração da equipe de futsal. Os horários noturnos se encaixam perfeitamente com a rotina de aulas.',
  }, // Futsal
];
