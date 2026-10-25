# Rotas de API — Unifor Sports Hub

> Atualizado em 21/10/2026. Autenticação e perfil próprio estão implementados. As demais rotas abaixo continuam como planejamento. Todos os endereços usam o prefixo `/api`.

## Autenticação implementada

| Método | Rota | Acesso | Comportamento e respostas |
|---|---|---|---|
| POST | `/api/auth/login` | Público | Recebe `identificador` (e-mail ou matrícula) e `senha`; 200 com dados públicos e cookie; 400 para entrada inválida; 401 para credenciais inválidas |
| GET | `/api/auth/sessao` | Sessão válida | 200 com `{ usuario: { idUsuario } }`; 401 para sessão ausente ou expirada |
| POST | `/api/auth/logout` | Não exige sessão válida | Invalida a sessão indicada e limpa o cookie; 204 sem corpo, inclusive se não houver sessão |

Login bem-sucedido retorna `{ mensagem, usuario }`, com `idUsuario`, `Nome` e `TipoUsuario`. O cookie `unifor_sid` contém um identificador opaco; a resposta não contém senha nem hash.

## Perfil próprio implementado

| Método | Rota | Entrada | Comportamento e respostas |
|---|---|---|---|
| GET | `/api/usuarios/me` | Sem ID enviado pelo cliente | 200 com `{ usuario }`; 401 sem sessão válida ou se o usuário da sessão não existir |
| PUT | `/api/usuarios/me` | `nome` e `email`, ambos obrigatórios | 200 com perfil atualizado; 400 para entrada inválida; 401 para sessão/usuário inválido; 409 para e-mail em uso |
| PUT | `/api/usuarios/me/senha` | `senhaAtual`, `novaSenha`, `confirmarNovaSenha` | 200 com mensagem solicitando novo login; invalida sessões do usuário e limpa o cookie; 400 para entrada inválida ou senha atual incorreta; 401 para sessão/usuário inválido |

O perfil público contém somente `idUsuario`, `Nome`, `Email`, `Matricula` e `TipoUsuario`.

### Regras de atualização

- O middleware `autenticar` preenche `req.auth.idUsuario` a partir da sessão; `/me` não usa ID do body nem parâmetro de URL.
- O PUT de perfil recebe os dois campos, mesmo se apenas um valor tiver mudado. Nome e e-mail são strings preenchidas, limitadas a 255 caracteres após `trim`; os valores também são salvos com `trim`.
- Somente `Nome` e `Email` entram no `data` do Prisma. IDs, matrícula, senha e tipo enviados como campos extras são ignorados, não atualizados.
- O backend aceita atualmente `@unifor.br` e `@edu.unifor.br` na edição. A restrição por perfil ainda precisa ser alinhada ao frontend.
- A nova senha deve ter de 15 a 128 caracteres e coincidir com a confirmação. Não se aplica `trim`. A senha atual só exige string não vazia na validação e é verificada pelo Argon2; não recebe o mínimo novo de 15 caracteres.
- A senha é persistida apenas como hash. Sucesso na troca exige novo login; uma senha atual incorreta não encerra a sessão.
- Erros de validação retornam `{ erros: [...] }`; os demais erros esperados retornam `{ mensagem: "..." }`.
- JSON malformado retorna 400. Falhas inesperadas são encaminhadas ao middleware e retornam 500 com mensagem genérica.

## Sessão e navegador

- Sessões em memória do backend, uma por usuário, com 15 minutos de inatividade. Novo login invalida a sessão anterior. Reiniciar o processo elimina as sessões.
- O cookie usa `HttpOnly`, `SameSite=Lax`, `Path=/` e `Secure` quando `NODE_ENV=production`. Não há `maxAge` fixo; o backend controla o prazo por inatividade.
- O frontend envia `credentials: 'include'`. CORS permite origens explícitas; os endereços do frontend e da API devem ser compatíveis com a política do cookie.
- A proteção de páginas consulta `/api/usuarios/me`. No frontend, `ExigirPerfil` só organiza a navegação; a permissão de fato é garantida no backend.

## Autorização de administrador

- Middleware `backend/middlewares/exigir-admin.cjs`, usado depois de `autenticar`: `router.post('/', autenticar, exigirAdmin, controller)`.
- Lê `TipoUsuario` do banco a cada requisição (uma conta rebaixada perde o acesso na hora, sem novo login) e preenche `req.auth.tipoUsuario`.
- Respostas: 401 se o usuário da sessão não existir; 403 `{ mensagem: "Acesso restrito ao administrador." }` para quem não é admin.
- Toda rota marcada como "Administrador" abaixo deve usar esse middleware.

## Cadastro planejado

| Método | Rota | O que faz | Status |
|---|---|---|---|
| POST | `/api/auth/cadastro` | Cria aluno (RF02.12), validando e-mail institucional e campos obrigatórios | não implementada |

## Esportes planejados

| Método | Rota | O que faz | Status |
|---|---|---|---|
| GET | `/api/esportes` | Lista os esportes do catálogo (RF05) | não implementada |
| GET | `/api/esportes/:id` | Detalhes de um esporte (RF08) | não implementada |
| POST | `/api/esportes` | Administrador cadastra um novo esporte (RF20) | não implementada |

## Inscrições em esporte planejadas

| Método | Rota | O que faz | Status |
|---|---|---|---|
| POST | `/api/inscricoes-esporte` | Aluno solicita inscrição, com status inicial `em_analise` (RF09) | não implementada |
| GET | `/api/inscricoes-esporte` | Lista inscrições do usuário identificado pela sessão (RF10) | não implementada |
| GET | `/api/inscricoes-esporte/pendentes` | Administrador consulta pendências (RF23) | não implementada |
| PATCH | `/api/inscricoes-esporte/:id` | Administrador aceita ou rejeita inscrição (RF23.8) | não implementada; `:id` = `inscricao_modalidade.id` |

A tabela `inscricao_modalidade` tem chave primária `id` (desde 25/10/2026), usada como identificador da inscrição na API; o par modalidade + usuário continua único. O usuário das operações pessoais deve vir da sessão; parâmetros do cliente não substituem autorização.

## Rotas de diagnóstico

- `GET /`: mensagem de funcionamento do backend.
- `GET /api/teste`: teste de resposta do servidor, sem consultar o MySQL. Um 200 nessa rota não comprova conexão com o banco.
