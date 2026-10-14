# Status atual — Unifor Sports Hub

> Atualizar esta tabela conforme as telas avançam. Última atualização: 14/10/2026.

## Grupo essencial (backend + banco reais)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF01 Login | ✅ pronto (com validação de campos obrigatórios) | ❌ login é `console.log`, aguardando `POST /auth/login` |
| RF02 Cadastro | ✅ pronto (validação de e-mail institucional, força de senha, confirmação) | ❌ cadastro é `console.log`, aguardando `POST /auth/cadastro` |
| RF04 Home | ⬜ não iniciado | ❌ |
| RF05 Esportes | ⬜ não iniciado | ❌ |
| RF08 Detalhes do esporte | ⬜ não iniciado | ❌ |
| RF09 Popup inscrição no esporte | ⬜ não iniciado | ❌ |
| RF10 Minhas inscrições | ⬜ não iniciado | ❌ |
| RF17 Configurações | ⬜ não iniciado | ❌ |
| RF19 Gerência | ⬜ não iniciado | ❌ |
| RF20 Criar esporte | ⬜ não iniciado | ❌ |
| RF23 Gerenciar inscrições | ⬜ não iniciado | ❌ |

## Grupo "sempre fácil" (baixo custo, não cortar)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF03 Esqueceu a senha | ⬜ não iniciado | ❌ |
| RF11 Detalhes da inscrição | ⬜ não iniciado | ❌ |
| RF18 Popup sair da conta | ⬜ não iniciado | ❌ |

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
| React Router | ✅ instalado e configurado |
| Backend (Node + Express) | ✅ rodando, porta 3000, só com rota de teste |
| Banco de dados | ⬜ não escolhido, não criado |
| Backend ↔ banco | ⬜ não conectado |
