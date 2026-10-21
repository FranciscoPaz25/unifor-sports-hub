# Status atual — Unifor Sports Hub

> Atualizar esta tabela conforme as telas avançam. Última atualização: 21/10/2026.

## Grupo essencial (backend + banco reais)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF01 Login | ✅ pronto, com validação e mensagens de erro | ✅ `POST /api/auth/login`, senha verificada com Argon2 e sessão em cookie; redireciona para `/home` |
| RF02 Cadastro | ✅ pronto (validação de e-mail institucional, força de senha, confirmação) | ❌ cadastro é `console.log`, aguardando `POST /auth/cadastro` |
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
| RF03 Esqueceu a senha | ⬜ não iniciado | ❌ |
| RF11 Detalhes da inscrição | ⬜ não iniciado | ❌ |
| RF18 Popup sair da conta | ✅ pronto, com estado de envio e mensagens de erro | ✅ `POST /api/auth/logout` invalida a sessão no servidor e remove o cookie |

## Grupo secundário (pode ficar mockado)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF06 Resultados de busca | ⬜ não iniciado | — |
| RF07 Popup de filtros | ⬜ não iniciado | — |
| RF12 Resenhas | ⬜ não iniciado | — |
| RF13 Popup resenha | ⬜ não iniciado | — |
| RF21 Aceitar resenhas | ⬜ não iniciado | — |

## Grupo "se sobrar tempo" (pode ficar só visual)

| Tela | Visual (React) |
|---|---|
| RF14 Eventos | ⬜ não iniciado |
| RF15 Detalhes do evento | ⬜ não iniciado |
| RF16 Popup inscrição evento | ⬜ não iniciado |
| RF22 Criar evento | ⬜ não iniciado |

## Infraestrutura

| Item | Status |
|---|---|
| Frontend (Vite + React) | ✅ rodando, porta 5173 |
| React Router | ✅ instalado e configurado, com NavLink ativo na navbar |
| Navbar | ✅ avatar e nome do usuário real; atualiza o nome após salvar o perfil |
| Mocks compartilhados | 🟡 esportes, eventos e inscrições ainda usam mocks; login, Navbar, Home e Configurações usam o usuário real |
| Backend (Node + Express) | ✅ porta 3000; rotas de autenticação e perfil, middlewares de sessão e tratamento de erros |
| Banco de dados | ✅ MySQL 8.4 configurado via Docker Compose; banco local `unifor_hub` existente |
| Prisma | ✅ versão 7.10.1, schema com oito tabelas e configuração por `DATABASE_URL` |
| Histórico de migrations | ✅ `0_init` registrada como aplicada |
| Correção da matrícula | 🟡 migration `20261018_corrige_matricula` criada; confirmar aplicação |
| Backend ↔ banco | ✅ cliente Prisma compartilhado em `backend/lib/prisma.cjs`; consulta e atualização de usuários |
| Sessões | ✅ em memória, uma por usuário, expiração após 15 minutos de inatividade; reinício exige novo login |
| Proteção de páginas | 🟡 consulta perfil antes de renderizar; autorização administrativa ainda não implementada |

## Resumo rápido

- **Telas essenciais com interface implementada:** 11 de 11; integração de esportes, eventos, inscrições e administração ainda pendente.
- **"Sempre fácil" prontas:** 1 de 3 — faltam RF03 e RF11.
- **Entrega atual:** autenticação por sessão, logout e gerenciamento do próprio perfil integrados ao MySQL.
- **Cadastro e recuperação de senha:** não implementados no backend.

## Verificação desta entrega

- Auditoria da API de perfil executada com duas contas fictícias: atualização persistida, 400 para entradas inválidas, 401 sem sessão, 409 para e-mail de outra conta e preservação da conta B ao enviar seu ID no body da conta A.
- Bateria de troca de senha em 21/10/2026: 15 verificações aprovadas, nenhuma falha. Inclui validação, senha atual incorreta, novo hash, cookie antigo rejeitado, login antigo rejeitado, login novo aceito, preservação de espaços e isolamento entre duas contas.
- As contas e sessões temporárias da auditoria foram removidas; contas existentes não foram alteradas.
- `npm run lint` do frontend passou. O build passou com saída temporária fora do repositório (`npm run build -- --outDir /tmp/unifor-build-audit-20261021 --configLoader runner`).
- O usuário confirmou funcionamento no navegador. O registro detalhado de todos os cenários manuais da tela ainda deve ser completado.
- Os scripts e relatórios de integração usados na auditoria ficaram em `/tmp`; a bateria ainda precisa ser adaptada e versionada. Os scripts em `backend/scripts` não equivalem a essa cobertura; `npm test` do backend ainda é o placeholder inicial.

## Pendências preservadas

- Alinhar a edição do e-mail por perfil: frontend limita aluno a `@edu.unifor.br`, enquanto backend aceita os dois domínios institucionais para qualquer usuário.
- Implementar autorização administrativa no backend e nas páginas. Ocultar links ou exibir o perfil na Navbar não substitui autorização.
- Tratar 401 nas futuras operações da API; a proteção visual consulta o perfil ao montar, não continuamente.
- Agendar `limparSessoesInativas`: a consulta já rejeita sessões expiradas, mas a remoção de sessões nunca mais consultadas ainda não é periódica.
- Registrar o procedimento de recuperação da conexão MySQL após reinício; houve falha RSA/pool durante a auditoria, seguida de uma execução aprovada, sem correção de conexão versionada nesta entrega.
