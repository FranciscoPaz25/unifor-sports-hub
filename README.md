# Unifor Sports Hub

Aplicação web para centralizar as informações e atividades esportivas da Universidade de Fortaleza: descoberta de modalidades, inscrições, avaliações e eventos, para alunos e administradores.

Projeto de Extensão da disciplina **Desenvolvimento de Plataformas Web** — Ciência da Computação, Turma T242, Unifor.

**Equipe:** João Francisco Morais Paz · Gleison Gomes Fraga Filho · João Gabriel Rocha Gomes · Marcio Jose Moura de Melo Junior

---

## Sobre o projeto

Existem dois perfis de usuário:

- **Aluno** — descobre esportes, se inscreve, avalia modalidades, participa de eventos.
- **Administrador** — cadastra esportes e eventos, gerencia vagas, modera avaliações. O acesso de administrador é criado direto no banco de dados (não existe tela de cadastro para ele).

O fluxo essencial do MVP é: aluno se cadastra → vê os esportes disponíveis → solicita inscrição → fica "Em análise" → administrador aprova ou rejeita → aluno vê a inscrição confirmada.

## Documentação do projeto

Toda a documentação técnica viva fica na pasta [`specs/`](./specs):

| Arquivo | Conteúdo |
|---|---|
| [`specs/modulos.md`](./specs/modulos.md) | Objetivo de cada módulo e quais telas ele cobre |
| [`specs/modelo-dados.md`](./specs/modelo-dados.md) | Tabelas e campos do banco de dados |
| [`specs/api-rotas.md`](./specs/api-rotas.md) | Rotas de API, planejadas e implementadas |
| [`specs/status.md`](./specs/status.md) | O que já está pronto, por tela — **comece por aqui** |
| [`specs/decisoes.md`](./specs/decisoes.md) | Regras fixas de UI e de negócio que valem para o projeto todo |

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite, React Router |
| Backend | Node.js + Express |
| Banco de dados | a definir (ver `specs/modelo-dados.md`) |

## Estrutura do repositório

```
unifor-sports-hub/
├── frontend/   # React + Vite — telas, componentes e serviços de API
├── backend/    # Node + Express — rotas da API
└── specs/      # documentação viva do projeto (ver acima)
```

## Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org/) instalado.

**1. Clone o repositório e instale as dependências de cada parte:**

```bash
git clone <url-do-repositorio>
cd unifor-sports-hub

cd frontend
npm install

cd ../backend
npm install
```

**2. Rode o backend** (porta 3000):

```bash
cd backend
node server.js
```

**3. Em outro terminal, rode o frontend** (porta 5173):

```bash
cd frontend
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

> O backend ainda não está conectado a um banco de dados — hoje só expõe uma rota de teste (`GET /api/teste`) para confirmar a comunicação entre frontend e backend.

## Fluxo de trabalho no Git

- `main` — branch estável, integrada pelo time.
- Cada integrante trabalha na própria branch (ex.: `francisco-dev`), dá push e integra via PR/merge.

## Status atual

Veja [`specs/status.md`](./specs/status.md) para o progresso tela a tela. Resumo rápido: Login e Cadastro têm o visual pronto, ainda sem integração com o backend; as demais telas essenciais estão em desenvolvimento.
