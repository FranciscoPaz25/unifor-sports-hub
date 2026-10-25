# CLAUDE.md — Unifor Sports Hub

Contexto para o Claude Code (e para qualquer pessoa do time) continuar o projeto. Leia antes de qualquer tarefa. Este arquivo resume e aponta para a documentação viva em `specs/` — em caso de conflito, **o código e `specs/` valem mais que este resumo**; corrija este arquivo quando notar divergência.

> Atualizado em 25/10/2026, com a `main` após o cadastro de aluno.

## 1. O projeto

Aplicação web que centraliza as atividades esportivas da Universidade de Fortaleza (Unifor): catálogo de modalidades, inscrições com aprovação, avaliações (resenhas), eventos e área de gestão.

- Projeto de Extensão da disciplina **Desenvolvimento de Plataformas Web** — Ciência da Computação, turma T242.
- Equipe: João Francisco Morais Paz (telas do aluno, integração na `main`), João Gabriel Rocha Gomes (telas do admin), Gleison Gomes Fraga Filho (banco, autenticação e perfil), Marcio Jose Moura de Melo Junior.
- Perfis: **aluno** e **admin**. O admin é criado pelo seed ou direto no banco (não há tela de cadastro para ele).
- Fluxo central do MVP: aluno se cadastra → vê esportes → solicita inscrição → fica `em_analise` → admin aceita ou rejeita → aluno vê o status em Minhas inscrições.
- Parte do time ainda está aprendendo backend: ao explicar algo de backend, banco ou Git, use linguagem simples e defina os termos (há um glossário no `README.md`).

## 2. Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite, React Router 7, CSS por componente (sem framework de UI), JavaScript (sem TypeScript) |
| Backend | Node.js + Express 5, CommonJS (`.cjs`), `cookie-parser`, `cors`, `argon2`, `dotenv` |
| Banco | MySQL 8.4 via Docker Compose (`backend/compose.yaml`, porta local 3308) |
| ORM | Prisma 7.10.1 com `@prisma/adapter-mariadb`; client gerado em `backend/generated/prisma` (TypeScript, importado via `tsx`) |

Não troque nem adicione peças da stack sem pedir ao usuário.

## 3. Git

- `main` é a branch estável. Cada integrante trabalha na própria branch (ex.: `francisco-dev`) e integra por PR.
- Histórico das entregas e dos PRs: `specs/historico.md`.
- Commits em português, no formato `tipo(escopo): resumo` (ex.: `feat(auth): ...`, `fix: ...`), com corpo explicando o que e por quê.

## 4. Como rodar

Passo a passo completo no `README.md`. Resumo:

```bash
cp backend/.env.example backend/.env      # preencher senhas e SEED_ADMIN_*
cd backend && npm install
docker compose up -d mysql
npx prisma migrate deploy && npx prisma generate
npm run seed                              # locais + admin
npm run dev                               # tsx watch ./server.js — porta 3000
cd ../frontend && npm install && npm run dev   # porta 5173
```

- O backend importa o Prisma Client gerado em `.ts`: rode com `npm run dev` (tsx), não com `node server.js`.
- Endereços: o frontend usa `VITE_API_URL` (`frontend/src/utils/api.js`, padrão `http://localhost:3000`); o backend aceita as origens de `CORS_ORIGINS` (padrão `http://localhost:5173`). Para acessar de outro aparelho, configure os dois `.env`.
- Depois de puxar mudanças da `main`: `npm install`, `npx prisma migrate deploy`, `npx prisma generate` no backend.
- Para testar sem mexer no banco de ninguém, suba um MySQL descartável em outra porta (ex.: `docker run ... -p 127.0.0.1:3399:3306 mysql:8.4`) e aponte `DATABASE_URL` para ele.

## 5. Estrutura

```
backend/
  server.js                    # app Express: dotenv, CORS, json, cookies, rotas, tratar-erros
  lib/prisma.cjs               # PrismaClient compartilhado
  middlewares/autenticar.cjs   # cookie unifor_sid → req.auth.idUsuario (401 se inválida)
  middlewares/exigir-admin.cjs # depois de autenticar: TipoUsuario do banco; 403 se não for admin
  middlewares/tratar-erros.cjs # JSON malformado → 400; resto → 500 genérico (erro completo no log)
  modules/<modulo>/            # padrão: <m>.routes / .controller / .service / .validacao (.cjs)
    auth/                      # cadastro, login, logout, sessão (Map em memória)
    usuarios/                  # /me, editar perfil, trocar senha
  prisma/schema.prisma, prisma/migrations/, prisma/seed.cjs
  scripts/testar-sessao.cjs    # teste manual da lógica de sessão (assert)
frontend/src/
  App.jsx                      # rotas: públicas → RotaProtegida → Layout → (compartilhadas | ExigirPerfil aluno | ExigirPerfil admin)
  components/                  # Navbar, Layout, Card, RotaProtegida, ExigirPerfil
  pages/auth|aluno|admin|compartilhadas/<Tela>/<Tela>.jsx + .css
  popups/<Popup>/
  mocks/                       # esportes, eventos, inscricoes, resenhas, usuario (ainda usados)
  utils/api.js                 # API_URL
  utils/perfil.js              # homeDoPerfil(tipo)
  utils/validacao.js           # e-mail institucional por perfil
specs/                         # documentação viva (seção 7)
```

Convenções:
- Nomes, comentários, textos e mensagens em **português do Brasil**.
- Todo arquivo de tela começa com `// Tela NN — Nome (RFNN)`.
- Uma pasta por tela/popup, com `.jsx` e `.css` de mesmo nome. Middlewares em kebab-case (`exigir-admin.cjs`).
- Rotas da API sempre sob `/api/...`. Operações do próprio usuário usam `/me` e a identidade da sessão — nunca um ID enviado pelo cliente.
- Rotas de admin: `autenticar, exigirAdmin` antes do controller.
- Erros de validação: `{ erros: [...] }`; demais erros: `{ mensagem: "..." }`. Textos padronizados em `specs/decisoes.md`.
- Colunas do banco seguem o modelo físico (`idUsuario`, `Nome`, `TipoUsuario`, `ModalidadeEsportiva_idModalidade`…). Não renomeie.
- Migration já aplicada não se edita; correções vão em migration nova.
- Cor primária `#003DA5`.

## 6. ⚠️ Numeração: "RFnn" no código ≠ "RFnn" do documento acadêmico

- **No repositório**, `RFnn` = número da **tela** (01 a 23), conforme o protótipo de baixa fidelidade. Ex.: `RF11` = tela Detalhes da inscrição; `RF23` = Gerenciar inscrições.
- **No `documentacaoWeb-1.3.docx`** (entregável da disciplina, fora do repo), `RF11` = "Controlar disponibilidade de vagas"; não existe RF23.

Ao falar de requisito, diga sempre "tela 11" ou "RF11 do docx".

## 7. Documentação viva (`specs/`)

| Arquivo | Uso |
|---|---|
| `specs/status.md` | Status tela a tela (visual × integrado) e infraestrutura. **Comece por aqui.** |
| `specs/historico.md` | O que entrou na `main`, quando e por quê; questões em aberto. |
| `specs/decisoes.md` | Regras fixas de UI, de negócio, de autenticação e textos de erro. **Obrigatório respeitar.** |
| `specs/modelo-dados.md` | Tabelas, campos, constraints, seed e pendências do banco. |
| `specs/api-rotas.md` | Rotas implementadas (com códigos de resposta) e planejadas. |
| `specs/modulos.md` | Módulos do MVP e telas de cada um. |

Ao terminar qualquer entrega: atualize `status.md`, registre em `historico.md` e, se for o caso, `api-rotas.md` / `modelo-dados.md` / `decisoes.md`, com a data.

## 8. Regras mais importantes

(Lista completa em `specs/decisoes.md`.)

- Toda inscrição em esporte nasce `em_analise`; só o admin confirma ou rejeita (tela 23).
- Cancelar inscrição (aluno) e Excluir esporte/evento (admin) agem direto, **sem** popup. Sair da conta tem popup (tela 18).
- Detalhes do esporte (tela 08) é compartilhada: aluno vê "Inscrever-se", admin vê "Excluir".
- Tag de vagas sempre "**[n] vagas disponíveis**".
- E-mail de aluno: só `@edu.unifor.br`. Matrícula: 7 dígitos, `^[0-9]{2}[1-2][0-9]{4}$`.
- Senha (cadastro e troca): 15 a 128 caracteres, sem `trim`; armazenada só como hash Argon2.
- Sessão: em memória, uma por usuário, expira com 15 min de inatividade, cookie `unifor_sid` HttpOnly/SameSite=Lax. Reiniciar o backend desloga todos.
- Após o login: aluno → `/home`, admin → `/admin/home`. Telas de um perfil redirecionam o outro para a própria home; `/esportes` e `/esportes/:id` são compartilhadas.
- Não reintroduzir o que já foi descartado (lista no fim de `decisoes.md`).

## 9. Estado atual (25/10/2026)

**Integrado ao banco:** Cadastro (02), Login (01), Sair da conta (18), Configurações (17), usuário real na Navbar e na Home, autorização por perfil (frontend e backend).

**Visual pronto, ainda em mocks:** Home (04: esportes/eventos), Esportes (05), Detalhes do esporte (08), Popup inscrição (09), Minhas inscrições (10), Detalhes da inscrição (11), Gerência (19), Criar esporte (20), Aceitar resenhas (21), Criar evento (22), Gerenciar inscrições (23). Esqueceu a senha (03) é só visual (fora do MVP no backend).

**Não iniciadas:** Resultados de busca (06), Popup de filtros (07), Resenhas (12), Popup de resenha (13), Eventos (14), Detalhes do evento (15), Popup inscrição em evento (16), Home do admin (`/admin/home` mostra "Em construção").

## 10. Pendências conhecidas

1. Rotas de esportes e de inscrições (planejadas em `api-rotas.md`).
2. Controle de vagas no backend seguro contra requisições simultâneas.
3. Home do admin.
4. Alinhar domínio de e-mail por perfil na edição de perfil (backend aceita `@unifor.br` para aluno).
5. CSRF e limite de tentativas de login (antes de qualquer uso real).
6. Agendar `limparSessoesInativas`.
7. Testes automatizados: `npm test` do backend é placeholder.
8. Armazenamento de imagens (não existe `imagem_url`; Criar esporte não faz upload real).
9. Questões em aberto em `specs/historico.md` (nova inscrição após cancelamento, status "rejeitada", "Esportes" na navbar do admin, status de resenhas) — **pergunte ao usuário antes de implementar algo que dependa delas.**

## 11. Próximos passos

Ordem do time (autenticação → esportes → inscrições → configurações), considerando o que já foi feito:

1. Esportes: `GET /api/esportes`, `GET /api/esportes/:id`, `POST /api/esportes` e exclusão (admin, com `exigirAdmin`) → ligar telas 04, 05, 08, 20.
2. Inscrições: `POST`, `GET` (do usuário), cancelar, `GET /pendentes`, `PATCH /:id` → ligar telas 09, 10, 11, 23, com checagem de vagas em transação.
3. Home do admin.
4. Depois, conforme o tempo: resenhas (12, 13, 21), busca/filtros (06, 07), eventos (14, 15, 16, 22).
