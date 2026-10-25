// Endereço do backend. Configure VITE_API_URL em frontend/.env (ver .env.example).
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Chama a API com o cookie de sessão e devolve { ok, status, dados }.
// `corpo` vira JSON. Em falha de rede lança erro (tratar com try/catch na tela).
export async function chamarApi(caminho, { metodo = 'GET', corpo } = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: metodo,
    credentials: 'include',
    headers: corpo !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
  });

  // 204 e respostas sem JSON chegam com dados vazios
  const dados = await resposta.json().catch(() => ({}));
  return { ok: resposta.ok, status: resposta.status, dados };
}

// Texto de erro para mostrar na tela a partir da resposta da API
export function mensagemDeErro(dados, padrao) {
  if (Array.isArray(dados?.erros)) return dados.erros.join(' ');
  return dados?.mensagem || padrao;
}
