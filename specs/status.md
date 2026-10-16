# Status atual — Unifor Sports Hub

> Atualizar esta tabela conforme as telas avançam. Última atualização: 15/10/2026.

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
| RF19 Gerência | ⬜ não iniciado — próxima da fila | ❌ |
| RF20 Criar esporte | ⬜ não iniciado | ❌ |
| RF23 Gerenciar inscrições | ⬜ não iniciado | ❌ |

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
| Banco de dados | ⬜ não escolhido, não criado |
| Backend ↔ banco | ⬜ não conectado |

## Resumo rápido

- **Telas essenciais prontas (visual):** 8 de 11 — faltam RF19, RF20, RF23.
- **"Sempre fácil" prontas:** 1 de 3 — faltam RF03, RF11.
- **Total de telas visuais restantes antes de partir pro banco de dados: 5.**
