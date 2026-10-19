# Status atual — Unifor Sports Hub

> Atualizar esta tabela conforme as telas avançam. Última atualização: 19/10/2026.

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

`components/` guarda só peças reutilizáveis (Navbar, Layout, Card).

## Grupo essencial (backend + banco reais)

| Tela | Visual (React) | Conectado ao backend/banco |
|---|---|---|
| RF01 Login | ✅ pronto (com validação de campos obrigatórios) | ❌ login é `console.log`, aguardando `POST /auth/login` |
| RF02 Cadastro | ✅ pronto (validação de e-mail institucional, matrícula de 7 dígitos, força de senha, confirmação) | ❌ cadastro é `console.log`, aguardando `POST /auth/cadastro` |
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
| RF03 Esqueceu a senha | ✅ pronto (solicitação + confirmação "E-mail enviado!") | ➖ fora do MVP: não consulta o banco nem envia e-mail (RF03.8/RF03.9) |
| RF11 Detalhes da inscrição | ✅ pronto (dados do esporte, data da inscrição, cancelar inscrição) | ❌ usa `mocks/inscricoes.js` e `mocks/esportes.js` |
| RF18 Popup sair da conta | ✅ pronto (feito junto com RF17) | ❌ só redireciona pro login, sem limpar sessão real |

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
| Navbar | ✅ avatar + nome do usuário, item ativo destacado |
| Mocks compartilhados | ✅ `mocks/esportes.js`, `mocks/eventos.js`, `mocks/inscricoes.js`, `mocks/usuario.js`, `mocks/resenhas.js` (matrículas no formato de 7 dígitos) |
| Backend (Node + Express) | ✅ rodando, porta 3000, só com rota de teste |
| Banco de dados | ✅ MySQL 8.4 configurado via Docker Compose; banco local `unifor_hub` existente |
| Prisma | ✅ versão 7.10.1, schema com oito tabelas e configuração por `DATABASE_URL` |
| Histórico de migrations | ✅ `0_init` registrada como aplicada |
| Correção da matrícula | 🟡 migration `20261018_corrige_matricula` criada; confirmar aplicação |
| `id` em `inscricao_modalidade` | ⬜ decidido adicionar coluna `id` autoincremento (o frontend já usa `inscricao.id`); migration ainda não criada |
| Seed (dados iniciais) | ⬜ falta script com locais e um usuário admin — sem eles não dá pra criar esporte |
| Backend ↔ banco | ⬜ Express ainda não utiliza o Prisma para consultar ou gravar dados |

## Resumo rápido

- **Telas essenciais prontas (visual):** 11 de 11.
- **"Sempre fácil" prontas:** 3 de 3.
- **Extras já prontos (visual):** RF21 Aceitar resenhas e RF22 Criar evento.
- **Total de telas visuais restantes antes de partir pro banco de dados: 0.**
- **MySQL e Prisma estão configurados; a próxima etapa de integração é criar a migration do `id` e o seed, e então conectar o Express ao banco** (ordem: autenticação → esportes → inscrições → configurações).
