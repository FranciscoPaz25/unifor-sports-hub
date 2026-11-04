# Status atual — Unifor Sports Hub

> Atualizar esta tabela conforme as telas avançam. Última atualização: 04/11/2026.

## Onde fica cada tela

Numeração igual à do documento do projeto (protótipo de baixa fidelidade). As telas ficam em `frontend/src/pages/`, agrupadas por perfil: `auth/` (sem navbar), `aluno/`, `admin/` e `compartilhadas/` (usadas pelos dois perfis). Popups ficam em `frontend/src/popups/`. Cada arquivo começa com o comentário `// Tela NN — Nome (RFNN)`.

| Tela | Nome | Arquivo |
|---|---|---|
| 01 | Login | `pages/auth/Login/` |
| 02 | Cadastro | `pages/auth/Cadastro/` |
| 03 | Esqueceu a senha | `pages/auth/EsqueceuSenha/` |
| 04 | Home | `pages/aluno/Home/` |
| 05 | Esportes | `pages/aluno/Esportes/` |
| 06 | Resultados de busca | `pages/aluno/ResultadosBusca/` (rota `/esportes/busca`, compartilhada) |
| 07 | Popup de filtros de busca | `popups/PopupFiltros/` |
| 08 | Detalhes do esporte | `pages/compartilhadas/DetalhesEsporte/` |
| 09 | Popup de confirmar inscrição no esporte | `popups/PopupInscricaoEsporte/` |
| 10 | Minhas inscrições | `pages/aluno/MinhasInscricoes/` |
| 11 | Detalhes da inscrição | `pages/aluno/DetalhesInscricao/` |
| 12 | Avaliações (resenhas) | `pages/compartilhadas/Resenhas/` (rota `/esportes/:id/resenhas`) |
| 13 | Popup de enviar resenha | `popups/PopupResenha/` |
| 14 | Eventos | — (vai em `pages/compartilhadas/`) |
| 15 | Detalhes do evento | — (vai em `pages/compartilhadas/`) |
| 16 | Popup de inscrição no evento | — (vai em `popups/`) |
| 17 | Configurações | `pages/compartilhadas/Configuracoes/` |
| 18 | Popup de sair da conta | `popups/PopupSairConta/` |
| 19 | Gerência | `pages/admin/Gerencia/` |
| 20 | Criar esporte | `pages/admin/CriarEsporte/` |
| 21 | Aceitar resenhas | `pages/admin/AceitarResenhas/` |
| 22 | Criar evento | `pages/admin/CriarEvento/` |
| 23 | Gerenciar inscrições | `pages/admin/GerenciarInscricoes/` |
| — | Home do admin (sem número próprio) | `pages/admin/HomeAdmin/` |

`components/` guarda só peças reutilizáveis (Navbar, Layout, Card, RotaProtegida, ExigirPerfil, BarraBusca, Estrelas, IconeEsporte).

## Grupo essencial (backend + banco reais)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF01 Login | ✅ pronto, com validação e mensagens de erro | ✅ `POST /api/auth/login`, senha verificada com Argon2 e sessão em cookie; redireciona aluno para `/home` e admin para `/admin/home` |
| RF02 Cadastro | ✅ pronto (validação de e-mail institucional, matrícula de 7 dígitos, senha de 15 a 128 caracteres com indicador de força, confirmação) | ✅ `POST /api/auth/cadastro` cria o aluno no banco (hash Argon2); e-mail/matrícula repetidos → 409; abre a sessão e leva direto à Home |
| RF04 Home | ✅ pronto (saudação, busca, destaque de esportes e eventos) | 🟡 usuário real e 4 primeiros esportes de `GET /api/esportes`; a busca leva à tela 06; eventos continuam em mock |
| RF05 Esportes | ✅ pronto (catálogo completo, busca) | ✅ `GET /api/esportes` (ordem alfabética); a busca e os filtros levam à tela 06 |
| RF08 Detalhes do esporte | ✅ pronto (nota, informações, avaliações, variação ADM "Excluir") | ✅ `GET /api/esportes/:id`; "Excluir" do admin usa `DELETE /api/esportes/:id`; nota e avaliações vêm de `avaliar` (só aprovadas); capa com o ícone escolhido e a categoria |
| RF09 Popup inscrição no esporte | ✅ pronto (confirmação, validação de já-inscrito/vagas) | ✅ `POST /api/inscricoes-esporte`; bloqueia sem vagas ou se já inscrito |
| RF10 Minhas inscrições | ✅ pronto (lista, status, estado vazio) | ✅ inscrições em esporte de `GET /api/inscricoes-esporte` (inclui "Rejeitada"); inscrições em evento só entram quando o módulo de eventos existir |
| RF17 Configurações | ✅ pronto (editar perfil, trocar senha, sair da conta) | ✅ perfil real, atualização de nome/e-mail e troca de senha conectados; regra de domínio por perfil no backend ainda pendente |
| RF19 Gerência | ✅ interface implementada, com links para funções administrativas | ❌ sem integração com backend |
| RF20 Criar esporte | ✅ formulário implementado; campo Local virou lista dos locais do banco | ✅ `POST /api/esportes` (só admin) grava modalidade, dias e o ícone escolhido numa lista de ícones padrão (o envio de foto saiu: imagens são sempre genéricas) |
| RF23 Gerenciar inscrições | ✅ lista de pendências, aprovação e rejeição implementadas | ✅ `GET /api/inscricoes-esporte/pendentes` e `PATCH /api/inscricoes-esporte/:id`; não confirma além da capacidade |

## Grupo "sempre fácil" (baixo custo, não cortar)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF03 Esqueceu a senha | ✅ pronto (solicitação + confirmação "E-mail enviado!") | ➖ fora do MVP: não consulta o banco nem envia e-mail (RF03.8/RF03.9) |
| RF11 Detalhes da inscrição | ✅ pronto (dados do esporte, data da inscrição, cancelar inscrição) | ✅ `GET /api/inscricoes-esporte/:id` e `PATCH .../:id/cancelar`; botão Cancelar só para em análise ou confirmada |
| RF18 Popup sair da conta | ✅ pronto, com estado de envio e mensagens de erro | ✅ `POST /api/auth/logout` invalida a sessão no servidor e remove o cookie |


## Grupo secundário (pode ficar mockado)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF06 Resultados de busca | ✅ pronto (barra de busca, filtros ativos removíveis, total, cards com dias/horário e nota, estado vazio) | ✅ `GET /api/esportes?busca=&categoria=`; busca ignora maiúsculas e acentos |
| RF07 Popup de filtros | ✅ pronto (categoria; Limpar e Aplicar) | ✅ filtro por categoria (decisão de 04/11/2026) |
| RF12 Resenhas | ✅ pronto (média, barras por nota, sua avaliação com status, lista das aprovadas) | ✅ `GET /api/avaliacoes/esporte/:id` |
| RF13 Popup resenha | ✅ pronto (1 a 5 estrelas, comentário opcional até 255 caracteres) | ✅ `PUT /api/avaliacoes/esporte/:id`; só com inscrição confirmada; só estrelas entra aprovada, com comentário vai para análise |
| RF21 Aceitar resenhas | ✅ pronto (aceitar/rejeitar resenhas pendentes) | ✅ `GET /api/avaliacoes/pendentes` e `PATCH /api/avaliacoes/:idEsporte/:idAluno` |

## Grupo "se sobrar tempo" (pode ficar só visual)

| Tela | Visual (React) |
|---|---|
| RF14 Eventos | ⬜ não iniciado |
| RF15 Detalhes do evento | ⬜ não iniciado |
| RF16 Popup inscrição evento | ⬜ não iniciado |
| RF22 Criar evento | ✅ pronto (formulário; adiciona evento ao mock em memória) |

## Infraestrutura

| Item | Status |
|---|---|
| Frontend (Vite + React) | ✅ rodando, porta 5173 |
| React Router | ✅ instalado e configurado, com NavLink ativo na navbar |
| Navbar | ✅ avatar e nome do usuário real; atualiza o nome após salvar o perfil; fixa no topo ao rolar |
| Estilo base (`index.css`) | ✅ desde 04/11/2026: fundo cinza-claro, cores sempre claras, telas mais largas (até 1160 px nas listas e 880 px nos detalhes). Antes era o modelo do Vite, que espremia tudo numa coluna e trocava as cores no modo escuro |
| Mocks compartilhados | 🟡 Esportes, inscrições em esporte e avaliações usam o banco. Continua em mock só eventos (`mocks/eventos.js`) |
| Controle de vagas | ✅ transação com `SELECT ... FOR UPDATE` no esporte e isolamento `READ COMMITTED`; duas confirmações simultâneas para a última vaga → só uma passa |
| Chamadas à API no frontend | ✅ `utils/api.js`: `chamarApi(caminho, { metodo, corpo })` envia o cookie e devolve `{ ok, status, dados }`; `mensagemDeErro(dados, padrao)` monta o texto de erro |
| Backend (Node + Express) | ✅ porta 3000; rotas de cadastro, autenticação e perfil, middlewares de sessão, autorização de admin e tratamento de erros |
| Banco de dados | ✅ MySQL 8.4 configurado via Docker Compose; banco local `unifor_hub` existente |
| Prisma | ✅ versão 7.10.1, schema com oito tabelas e configuração por `DATABASE_URL` |
| Histórico de migrations | ✅ `0_init` registrada como aplicada |
| Correção da matrícula | 🟡 migration `20261018_corrige_matricula` criada; confirmar aplicação |
| Avaliações e ícones (04/11/2026) | ✅ migrations `20261104_avaliar_status_aprovada` (`avaliar.Status`: em_analise / aprovada / rejeitada, convertendo os valores antigos) e `20261104_modalidade_icone` (coluna `Icone`, padrão `geral`) |
| `id` em `inscricao_modalidade` | ✅ migration `20261025_inscricao_modalidade_id`: `id` autoincremento como chave primária; par modalidade + usuário continua único |
| Seed (dados iniciais) | ✅ `npm run seed`: seis locais e um admin (dados em `SEED_ADMIN_*` no `.env`); pode ser repetido sem duplicar |
| Endereços da API e CORS | ✅ frontend usa `VITE_API_URL` (`utils/api.js`); backend lê `CORS_ORIGINS` do `.env` — padrão `localhost` |
| Backend ↔ banco | ✅ cliente Prisma compartilhado em `backend/lib/prisma.cjs`; consulta e atualização de usuários |
| Sessões | ✅ em memória, uma por usuário, expiração após 15 minutos de inatividade; reinício exige novo login |
| Proteção de páginas | ✅ `RotaProtegida` consulta o perfil; `ExigirPerfil` separa telas de aluno e de admin (quem não tem o perfil vai para a própria home); `/esportes`, `/esportes/busca`, `/esportes/:id` e `/esportes/:id/resenhas` são compartilhadas |
| Autorização de admin (backend) | ✅ middleware `exigir-admin.cjs` (usar depois de `autenticar`): lê `TipoUsuario` do banco; 403 para quem não é admin. Aplicar em toda rota administrativa nova |

## Resumo rápido

- **Telas essenciais:** todas com interface e ligadas ao banco, incluindo a Home do admin (`/admin/home`), que mostra inscrições pendentes, esportes cadastrados e atalhos.
- **"Sempre fácil" com interface pronta:** 3 de 3; RF18 integrado, RF11 ainda em mocks, RF03 fora do MVP no backend.
- **Busca e resenhas integradas (04/11/2026):** telas 06, 07, 12, 13 e 21 ligadas ao banco.
- **Extra só visual:** RF22 Criar evento.
- **Módulo de autenticação completo no backend:** cadastro, login, sessão, logout, perfil próprio, troca de senha e autorização de admin. Recuperação de senha (RF03) fica fora do MVP.
- **Módulo de esportes integrado:** listar, detalhar, criar e excluir (telas 04, 05, 08, 20).
- **Módulo de inscrições integrado:** pedir, acompanhar, cancelar, aceitar e rejeitar (telas 09, 10, 11, 23). O fluxo central do MVP funciona de ponta a ponta com o banco.
- **Próxima etapa:** testar as telas novas no banco local; depois o deploy. Eventos (14, 15, 16, 22) continuam sem backend. Não existe edição de esporte (a tela 20 só cria).
- **Histórico do que foi feito e por quê:** ver `historico.md`.

## Verificação da entrega de 04/11/2026

- API em MySQL 8.4 descartável, 37 verificações: busca sem acento ("volei" acha "Vôlei de Praia"), sem diferenciar maiúsculas, `%` tratado como texto, busca + categoria juntas; ícone padrão e ícone inválido (400); avaliar sem inscrição ou com inscrição em análise (403); nota fora de 1 a 5 e comentário com mais de 255 caracteres (400 com os dois erros); aluno não lista nem decide pendentes (403); duas decisões ao mesmo tempo na mesma avaliação → uma 200 e outra 409; aprovada entra na nota do esporte, da tela 12 e da busca; reenviar volta para análise e sai da nota; rejeitada aparece só para o autor; admin vê a tela 12 sem poder avaliar; sem login → 401.
- Migration de status testada com linhas no formato antigo: `confirmada` → `aprovada`, `cancelada` → `rejeitada`, `em_analise` mantido.
- Telas conferidas por capturas do navegador (Edge sem janela) a 1366 px e 375 px: Login, Cadastro, Home, Esportes, popup de filtros, Resultados (termo, categoria e vazio), Detalhes, Avaliações, popup de resenha, Minhas inscrições, Configurações, Home do admin, Gerência, Aceitar resenhas, Criar esporte e Gerenciar inscrições. Os cliques e envios pelas telas não foram feitos por mim; ficam para o teste manual. Lint e build sem erros.

## Verificação da entrega de 02/11/2026

- Home do admin, em MySQL 8.4 descartável: com 2 esportes e 1 pedido pendente, a tela mostra 1 e 2; o indicador de pendentes leva a Gerenciar inscrições, com o pedido listado; console sem erros; indicadores e atalhos em uma coluna a 375 px. A mensagem de erro do resumo não foi exercitada no navegador. Lint e build sem erros.

## Verificação das entregas de 25/10/2026

Todas testadas em um MySQL 8.4 descartável (container Docker separado do banco de cada integrante, removido depois):

- Migration do `id`: aplicada sobre inscrições existentes (ids atribuídos, duplicata recusada, cascade preservado) e em banco vazio (`prisma migrate diff` sem diferenças).
- Seed: executado duas vezes sem duplicar; login do admin criado pela API.
- Autorização de admin: rota de teste com `autenticar` + `exigirAdmin` → 401 sem login, 403 aluno, 200 admin, 403 logo após rebaixar o admin no banco.
- Redirecionamento por perfil: navegador com aluno e admin (cada um é devolvido à própria home ao abrir tela do outro perfil).
- Inscrições: API com admin tentando se inscrever (403), esporte inválido/inexistente, pedido repetido (409), pendentes só para admin, status inválido (400), confirmação sem vaga (409), decisão repetida (409), aluno vendo inscrição de outro (404), cancelar rejeitada (409), cancelar confirmada libera a vaga, novo pedido após rejeição reaproveita o registro; duas confirmações simultâneas em 5 rodadas → sempre só uma. Migration `rejeitada` sem diferença entre schema e banco. No navegador: aluno pede → "Em análise" → admin aceita um, recebe "Não há vagas…" no segundo e rejeita → aluno vê "Confirmada" → cancela → "Cancelada"; o outro aluno vê "Rejeitada".
- Esportes: API com 401 sem login, 403 para aluno criar/excluir, 400 com todos os erros de validação, local inexistente, 404 para id inexistente ou inválido; vagas descontando só inscrições confirmadas; nota contando só avaliações aprovadas; exclusão apagando dias, inscrições e avaliações em cascata. No navegador: admin cria "Natação Básica" (acentos preservados) → aparece em Esportes e na Home do aluno → detalhes com "Inscrever-se" (aluno) e "Excluir" (admin) → exclusão volta para a lista vazia.
- Cadastro: API com campos vazios, domínio errado, matrícula inválida, senha curta, confirmação diferente, tentativa de enviar `TipoUsuario: admin` (ignorado), e-mail repetido em maiúsculas e matrícula repetida; no navegador, cadastro → mensagem no login → login → Home.

## Verificação da entrega de 21/10/2026

- Auditoria da API de perfil executada com duas contas fictícias: atualização persistida, 400 para entradas inválidas, 401 sem sessão, 409 para e-mail de outra conta e preservação da conta B ao enviar seu ID no body da conta A.
- Bateria de troca de senha em 21/10/2026: 15 verificações aprovadas, nenhuma falha. Inclui validação, senha atual incorreta, novo hash, cookie antigo rejeitado, login antigo rejeitado, login novo aceito, preservação de espaços e isolamento entre duas contas.
- As contas e sessões temporárias da auditoria foram removidas; contas existentes não foram alteradas.
- O usuário confirmou funcionamento no navegador. O registro detalhado de todos os cenários manuais da tela ainda deve ser completado.
- Os scripts e relatórios de integração usados na auditoria ficaram em `/tmp`; a bateria ainda precisa ser adaptada e versionada. Os scripts em `backend/scripts` não equivalem a essa cobertura; `npm test` do backend ainda é o placeholder inicial.

## Pendências preservadas

- Alinhar a edição do e-mail por perfil: frontend limita aluno a `@edu.unifor.br`, enquanto backend aceita os dois domínios institucionais para qualquer usuário.
- Navbar não se adapta ao celular: a 375 px ela ocupa cerca de 595 px e cria rolagem lateral em todas as telas internas (visto em 02/11/2026).
- Tratar 401 nas futuras operações da API; a proteção visual consulta o perfil ao montar, não continuamente.
- Agendar `limparSessoesInativas`: a consulta já rejeita sessões expiradas, mas a remoção de sessões nunca mais consultadas ainda não é periódica.