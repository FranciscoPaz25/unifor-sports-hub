# Status atual — Unifor Sports Hub

> Atualizar esta tabela conforme as telas avançam. Última atualização: 18/10/2026.

## Grupo essencial (backend + banco reais)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF01 Login | ✅ pronto (com validação de campos obrigatórios) | ❌ login é `console.log`, aguardando `POST /auth/login` |
| RF02 Cadastro | ✅ pronto (validação de e-mail institucional, força de senha, confirmação) | ❌ cadastro é `console.log`, aguardando `POST /auth/cadastro` |
| RF04 Home | ✅ pronto (saudação, busca, destaque de esportes e eventos) | ❌ usa `mocks/esportes.js` e `mocks/eventos.js` |
| RF05 Esportes | ✅ pronto (catálogo completo, busca) | ❌ usa `mocks/esportes.js` |
| RF08 Detalhes do esporte | ✅ pronto (nota, informações, avaliações, variação ADM "Excluir") | ❌ usa `mocks/esportes.js` |
| RF09 Popup inscrição no esporte | ✅ pronto (confirmação, validação de já-inscrito/vagas) | ❌ usa `mocks/inscricoes.js` |
| RF10 Minhas inscrições | ✅ pronto (lista esporte+evento, status, estado vazio) | ❌ usa `mocks/inscricoes.js` |
| RF17 Configurações | ✅ pronto (editar perfil, trocar senha, sair da conta) | ❌ usa `mocks/usuario.js` |
| RF19 Gerência | ✅ interface implementada, com links para funções administrativas | ❌ sem integração com backend |
| RF20 Criar esporte | ✅ formulário implementado; upload real pendente | ❌ adiciona esporte ao mock em memória |
| RF23 Gerenciar inscrições | ✅ lista de pendências, aprovação e rejeição implementadas | ❌ altera inscrições no mock em memória |

## Grupo "sempre fácil" (baixo custo, não cortar)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF03 Esqueceu a senha | ⬜ não iniciado | ❌ |
| RF11 Detalhes da inscrição | ⬜ não iniciado | ❌ |
| RF18 Popup sair da conta | ✅ pronto (feito junto com RF17) | ❌ só redireciona pro login, sem limpar sessão real |

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
| Navbar | ✅ avatar + nome do usuário, item ativo destacado |
| Mocks compartilhados | ✅ `mocks/esportes.js`, `mocks/eventos.js`, `mocks/inscricoes.js`, `mocks/usuario.js` |
| Backend (Node + Express) | ✅ rodando, porta 3000, só com rota de teste |
| Banco de dados | ✅ MySQL 8.4 configurado via Docker Compose; banco local `unifor_hub` existente |
| Prisma | ✅ versão 7.10.1, schema com oito tabelas e configuração por `DATABASE_URL` |
| Histórico de migrations | ✅ `0_init` registrada como aplicada |
| Correção da matrícula | 🟡 migration `20261018_corrige_matricula` criada; confirmar aplicação |
| Backend ↔ banco | ⬜ Express ainda não utiliza o Prisma para consultar ou gravar dados |

## Resumo rápido

- **Telas essenciais prontas (visual):** 8 de 11 — faltam RF19, RF20, RF23.
- **"Sempre fácil" prontas:** 1 de 3 — faltam RF03, RF11.
- **Total de telas visuais restantes antes de partir pro banco de dados: 5.**
- **MySQL e Prisma estão configurados; a próxima etapa de integração é conectar o Express ao banco.**
