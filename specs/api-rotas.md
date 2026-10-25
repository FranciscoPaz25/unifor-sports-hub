# Rotas de API — Unifor Sports Hub

> Atualizado em 25/10/2026. Cadastro, autenticação, perfil próprio, autorização de admin, esportes e locais estão implementados. Inscrições continuam como planejamento. Todos os endereços usam o prefixo `/api`.

## Autenticação implementada

| Método | Rota | Acesso | Comportamento e respostas |
|---|---|---|---|
| POST | `/api/auth/cadastro` | Público | Recebe `nome`, `email`, `matricula`, `senha` e `confirmarSenha`; cria sempre um **aluno** (campos extras como `TipoUsuario` são ignorados); 201 `{ mensagem, usuario }` sem abrir sessão; 400 `{ erros }` para entrada inválida; 409 para e-mail ou matrícula já cadastrados |
| POST | `/api/auth/login` | Público | Recebe `identificador` (e-mail ou matrícula) e `senha`; 200 com dados públicos e cookie; 400 para entrada inválida; 401 para credenciais inválidas |
| GET | `/api/auth/sessao` | Sessão válida | 200 com `{ usuario: { idUsuario } }`; 401 para sessão ausente ou expirada |
| POST | `/api/auth/logout` | Não exige sessão válida | Invalida a sessão indicada e limpa o cookie; 204 sem corpo, inclusive se não houver sessão |

Regras do cadastro: nome obrigatório (até 255 caracteres, salvo com `trim`); e-mail só `@edu.unifor.br`; matrícula `^[0-9]{2}[1-2][0-9]{4}$`; senha de 15 a 128 caracteres, sem `trim`, igual à confirmação, salva só como hash Argon2. A checagem de e-mail repetido não diferencia maiúsculas. Mensagens de 409: "Este e-mail já está em uso." ou "Esta matrícula já está cadastrada.".

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

## Esportes implementados

Código em `backend/modules/esportes/`. Todas exigem sessão; criar e excluir exigem admin.

| Método | Rota | Acesso | Comportamento e respostas |
|---|---|---|---|
| GET | `/api/esportes` | Sessão válida | 200 `{ esportes: [...] }` em ordem alfabética (telas 04 e 05) |
| GET | `/api/esportes/:id` | Sessão válida | 200 `{ esporte }` com `avaliacoes` (as 2 aprovadas mais recentes); 404 "Esporte não encontrado." para id inexistente ou inválido (tela 08) |
| POST | `/api/esportes` | Admin | Recebe `nome`, `descricao`, `categoria`, `idLocal`, `dias` (números 1–7), `horarioInicio`, `horarioFim` (`HH:MM`), `responsavel`, `capacidadeMaxima`; 201 `{ mensagem, esporte }`; 400 `{ erros }` (inclui "Local não encontrado."); 403 para aluno (tela 20) |
| DELETE | `/api/esportes/:id` | Admin | 204; 404 se não existir; 403 para aluno. Apaga dias, inscrições e avaliações em cascata (tela 08, sem confirmação) |

Formato de cada esporte (mesmos nomes que os antigos mocks, para as telas mudarem pouco):

```json
{
  "id": 2, "nome": "Natação Básica", "descricao": "...", "categoria": "Aquático",
  "idLocal": 5, "local": "Piscina Olímpica",
  "capacidadeMaxima": 12, "vagas": 12,
  "dias": [2, 4], "diasSemana": "Terça e Quinta",
  "horarioInicio": "07:00", "horarioFim": "08:30",
  "responsavel": "Profª Luísa Araújo",
  "notaMedia": null, "totalAvaliacoes": 0
}
```

`vagas` = capacidade − inscrições confirmadas. `notaMedia` é `null` quando não há avaliação aprovada.

## Locais implementados

| Método | Rota | Acesso | Comportamento e respostas |
|---|---|---|---|
| GET | `/api/locais` | Sessão válida | 200 `{ locais: [{ id, nome, capacidade }] }` em ordem alfabética; alimenta o campo Local da tela 20 |

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
