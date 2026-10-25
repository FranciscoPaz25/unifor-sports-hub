# Status atual — Unifor Sports Hub

> Atualizar esta tabela conforme as telas avançam. Última atualização: 25/10/2026.

## Onde fica cada tela

Numeração igual à do documento do projeto (protótipo de baixa fidelidade). As telas ficam em `frontend/src/pages/`, agrupadas por perfil: `auth/` (sem navbar), `aluno/`, `admin/` e `compartilhadas/` (usadas pelos dois perfis). Popups ficam em `frontend/src/popups/`. Cada arquivo começa com o comentário `// Tela NN — Nome (RFNN)`.

| Tela | Nome | Arquivo |
|---|---|---|
| 01 | Login | `pages/auth/Login/` |
| 02 | Cadastro | `pages/auth/Cadastro/` |
| 03 | Esqueceu a senha | `pages/auth/EsqueceuSenha/` |
| 04 | Home | `pages/aluno/Home/` |
| 05 | Esportes | `pages/aluno/Esportes/` |
| 06 | Resultados de busca | — (vai em `pages/aluno/`) |
| 07 | Popup de filtros de busca | — (vai em `popups/`) |
| 08 | Detalhes do esporte | `pages/compartilhadas/DetalhesEsporte/` |
| 09 | Popup de confirmar inscrição no esporte | `popups/PopupInscricaoEsporte/` |
| 10 | Minhas inscrições | `pages/aluno/MinhasInscricoes/` |
| 11 | Detalhes da inscrição | `pages/aluno/DetalhesInscricao/` |
| 12 | Avaliações (resenhas) | — (vai em `pages/aluno/`) |
| 13 | Popup de enviar resenha | — (vai em `popups/`) |
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

`components/` guarda só peças reutilizáveis (Navbar, Layout, Card, RotaProtegida).

## Grupo essencial (backend + banco reais)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF01 Login | ✅ pronto, com validação e mensagens de erro | ✅ `POST /api/auth/login`, senha verificada com Argon2 e sessão em cookie; redireciona aluno para `/home` e admin para `/admin/home` |
| RF02 Cadastro | ✅ pronto (validação de e-mail institucional, matrícula de 7 dígitos, senha de 15 a 128 caracteres com indicador de força, confirmação) | ✅ `POST /api/auth/cadastro` cria o aluno no banco (hash Argon2); e-mail/matrícula repetidos → 409; leva ao login com "Conta criada. Faça login para continuar." |
| RF04 Home | ✅ pronto (saudação, busca, destaque de esportes e eventos) | 🟡 usuário real por `GET /api/usuarios/me`; esportes e eventos continuam em mocks |
| RF05 Esportes | ✅ pronto (catálogo completo, busca) | ❌ usa `mocks/esportes.js` |
| RF08 Detalhes do esporte | ✅ pronto (nota, informações, avaliações, variação ADM "Excluir") | ❌ usa `mocks/esportes.js` |
| RF09 Popup inscrição no esporte | ✅ pronto (confirmação, validação de já-inscrito/vagas) | ❌ usa `mocks/inscricoes.js` |
| RF10 Minhas inscrições | ✅ pronto (lista esporte+evento, status, estado vazio) | ❌ usa `mocks/inscricoes.js` |
| RF17 Configurações | ✅ pronto (editar perfil, trocar senha, sair da conta) | ✅ perfil real, atualização de nome/e-mail e troca de senha conectados; regra de domínio por perfil no backend ainda pendente |
| RF19 Gerência | ✅ interface implementada, com links para funções administrativas | ❌ sem integração com backend |
| RF20 Criar esporte | ✅ formulário implementado; upload real pendente | ❌ adiciona esporte ao mock em memória |
| RF23 Gerenciar inscrições | ✅ lista de pendências, aprovação e rejeição implementadas | ❌ altera inscrições no mock em memória |

## Grupo "sempre fácil" (baixo custo, não cortar)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF03 Esqueceu a senha | ✅ pronto (solicitação + confirmação "E-mail enviado!") | ➖ fora do MVP: não consulta o banco nem envia e-mail (RF03.8/RF03.9) |
| RF11 Detalhes da inscrição | ✅ pronto (dados do esporte, data da inscrição, cancelar inscrição) | ❌ usa `mocks/inscricoes.js` e `mocks/esportes.js` |
| RF18 Popup sair da conta | ✅ pronto, com estado de envio e mensagens de erro | ✅ `POST /api/auth/logout` invalida a sessão no servidor e remove o cookie |


## Grupo secundário (pode ficar mockado)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF06 Resultados de busca | ⬜ não iniciado | — |
| RF07 Popup de filtros | ⬜ não iniciado | — |
| RF12 Resenhas | ⬜ não iniciado | — |
| RF13 Popup resenha | ⬜ não iniciado | — |
| RF21 Aceitar resenhas | ✅ pronto (aceitar/rejeitar resenhas pendentes) | ❌ usa `mocks/resenhas.js` |

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
| Navbar | ✅ avatar e nome do usuário real; atualiza o nome após salvar o perfil |
| Mocks compartilhados | 🟡 esportes, eventos e inscrições ainda usam mocks; login, Navbar, Home e Configurações usam o usuário real |
| Backend (Node + Express) | ✅ porta 3000; rotas de cadastro, autenticação e perfil, middlewares de sessão, autorização de admin e tratamento de erros |
| Banco de dados | ✅ MySQL 8.4 configurado via Docker Compose; banco local `unifor_hub` existente |
| Prisma | ✅ versão 7.10.1, schema com oito tabelas e configuração por `DATABASE_URL` |
| Histórico de migrations | ✅ `0_init` registrada como aplicada |
| Correção da matrícula | 🟡 migration `20261018_corrige_matricula` criada; confirmar aplicação |
| `id` em `inscricao_modalidade` | ✅ migration `20261025_inscricao_modalidade_id`: `id` autoincremento como chave primária; par modalidade + usuário continua único |
| Seed (dados iniciais) | ✅ `npm run seed`: seis locais e um admin (dados em `SEED_ADMIN_*` no `.env`); pode ser repetido sem duplicar |
| Endereços da API e CORS | ✅ frontend usa `VITE_API_URL` (`utils/api.js`); backend lê `CORS_ORIGINS` do `.env` — padrão `localhost` |
| Backend ↔ banco | ✅ cliente Prisma compartilhado em `backend/lib/prisma.cjs`; consulta e atualização de usuários |
| Sessões | ✅ em memória, uma por usuário, expiração após 15 minutos de inatividade; reinício exige novo login |
| Proteção de páginas | ✅ `RotaProtegida` consulta o perfil; `ExigirPerfil` separa telas de aluno e de admin (quem não tem o perfil vai para a própria home); `/esportes` e `/esportes/:id` são compartilhadas |
| Autorização de admin (backend) | ✅ middleware `exigir-admin.cjs` (usar depois de `autenticar`): lê `TipoUsuario` do banco; 403 para quem não é admin. Aplicar em toda rota administrativa nova |

## Resumo rápido

- **Telas essenciais com interface implementada:** 11 de 11; integração de esportes, eventos, inscrições e administração ainda pendente.
- **"Sempre fácil" com interface pronta:** 3 de 3; RF18 integrado, RF11 ainda em mocks, RF03 fora do MVP no backend.
- **Extras já prontos (visual):** RF21 Aceitar resenhas e RF22 Criar evento.
- **Módulo de autenticação completo no backend:** cadastro, login, sessão, logout, perfil próprio, troca de senha e autorização de admin. Recuperação de senha (RF03) fica fora do MVP.
- **Próxima etapa:** esportes (`GET /api/esportes`, `GET /api/esportes/:id`, `POST /api/esportes`, exclusão) → inscrições → Home do admin.
- **Histórico do que foi feito e por quê:** ver `historico.md`.

## Verificação das entregas de 25/10/2026

Todas testadas em um MySQL 8.4 descartável (container Docker separado do banco de cada integrante, removido depois):

- Migration do `id`: aplicada sobre inscrições existentes (ids atribuídos, duplicata recusada, cascade preservado) e em banco vazio (`prisma migrate diff` sem diferenças).
- Seed: executado duas vezes sem duplicar; login do admin criado pela API.
- Autorização de admin: rota de teste com `autenticar` + `exigirAdmin` → 401 sem login, 403 aluno, 200 admin, 403 logo após rebaixar o admin no banco.
- Redirecionamento por perfil: navegador com aluno e admin (cada um é devolvido à própria home ao abrir tela do outro perfil).
- Cadastro: API com campos vazios, domínio errado, matrícula inválida, senha curta, confirmação diferente, tentativa de enviar `TipoUsuario: admin` (ignorado), e-mail repetido em maiúsculas e matrícula repetida; no navegador, cadastro → mensagem no login → login → Home.

## Verificação da entrega de 21/10/2026

- Auditoria da API de perfil executada com duas contas fictícias: atualização persistida, 400 para entradas inválidas, 401 sem sessão, 409 para e-mail de outra conta e preservação da conta B ao enviar seu ID no body da conta A.
- Bateria de troca de senha em 21/10/2026: 15 verificações aprovadas, nenhuma falha. Inclui validação, senha atual incorreta, novo hash, cookie antigo rejeitado, login antigo rejeitado, login novo aceito, preservação de espaços e isolamento entre duas contas.
- As contas e sessões temporárias da auditoria foram removidas; contas existentes não foram alteradas.
- O usuário confirmou funcionamento no navegador. O registro detalhado de todos os cenários manuais da tela ainda deve ser completado.
- Os scripts e relatórios de integração usados na auditoria ficaram em `/tmp`; a bateria ainda precisa ser adaptada e versionada. Os scripts em `backend/scripts` não equivalem a essa cobertura; `npm test` do backend ainda é o placeholder inicial.

## Pendências preservadas

- Alinhar a edição do e-mail por perfil: frontend limita aluno a `@edu.unifor.br`, enquanto backend aceita os dois domínios institucionais para qualquer usuário.
- Tratar 401 nas futuras operações da API; a proteção visual consulta o perfil ao montar, não continuamente.
- Agendar `limparSessoesInativas`: a consulta já rejeita sessões expiradas, mas a remoção de sessões nunca mais consultadas ainda não é periódica.