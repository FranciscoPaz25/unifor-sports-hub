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
| [`specs/historico.md`](./specs/historico.md) | O que entrou na `main`, quando e por quê; questões em aberto |
| [`CLAUDE.md`](./CLAUDE.md) | Resumo do projeto e convenções para quem usa o Claude Code (também serve como visão geral rápida) |

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite, React Router |
| Backend | Node.js + Express |
| Banco de dados | MySQL 8.4 via Docker Compose |
| ORM e migrations | Prisma 7.10.1 |

## Estrutura do repositório

```
unifor-sports-hub/
├── frontend/   # React + Vite — telas, componentes e serviços de API
├── backend/    # Node + Express — rotas da API
└── specs/      # documentação viva do projeto (ver acima)
```

## Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org/) instalado.
Docker Engine com Docker Compose v2, ou Docker Desktop.
Docker em execução.

**1. Clone o repositório e instale as dependências de cada parte:**

```bash
git clone <url-do-repositorio>
cd unifor-sports-hub

cd frontend
npm install

cd ../backend
npm install
```

**2. Configurar as variáveis de ambiente**

Na primeira configuração, copie o exemplo:

```bash
cp backend/.env.example backend/.env
```

Se backend/.env já existe, edite o arquivo existente.

Preencha com suas senhas locais:

```dotenv
MYSQL_ROOT_PASSWORD=defina_uma_senha_para_root
MYSQL_PASSWORD=defina_outra_senha_para_aplicacao
DATABASE_URL="mysql://unifor_app:defina_outra_senha_para_aplicacao@127.0.0.1:3308/unifor_hub"
CORS_ORIGINS=http://localhost:5173
```

- MYSQL_ROOT_PASSWORD: senha administrativa do MySQL.
- MYSQL_PASSWORD: senha do usuário unifor_app.
- DATABASE_URL: conexão utilizada pelo Prisma.
- A senha da URL deve corresponder a MYSQL_PASSWORD.
- CORS_ORIGINS: endereços do frontend aceitos pelo backend, separados por vírgula.

O frontend lê o endereço do backend de `VITE_API_URL` (padrão `http://localhost:3000`).
Para mudar, copie `frontend/.env.example` para `frontend/.env`.
Para acessar pela rede local, use o IP da máquina em `VITE_API_URL` e inclua
`http://<SEU_IP>:5173` em `CORS_ORIGINS`.

Caracteres especiais da senha precisam ser codificados na URL.
Por exemplo, @ vira %40 somente dentro de DATABASE_URL.

O arquivo .env é local e não deve ser enviado ao Git.
O .env.example contém apenas exemplos e deve ser versionado.

**3. Baixar e iniciar o MySQL**

Entre em backend:

```bash
cd backend

docker compose config --quiet
docker compose pull mysql
docker compose up -d mysql
docker compose logs --tail=50 mysql
```

Aguarde o MySQL informar que está pronto para conexões antes da próxima etapa.
Se necessário, consulte os logs novamente.

Configuração local:

- Endereço: 127.0.0.1.
- Porta na máquina: 3308.
- Porta dentro do container: 3306.
- Banco: unifor_hub.
- Usuário da aplicação: unifor_app.

Os dados ficam no volume Docker mysql_data.

As variáveis de criação de usuários e senhas são utilizadas na primeira
inicialização. Alterar o .env depois não troca automaticamente as senhas
de um banco já existente.

**4. Criar as tabelas e gerar o Prisma Client**

Ainda dentro de backend:

```bash
npx prisma validate
npx prisma migrate deploy
npx prisma generate
npx prisma migrate status
```

- validate verifica o schema.
- migrate deploy executa as migrations pendentes.
- generate gera o Prisma Client em backend/generated/prisma.
- migrate status mostra a situação do histórico.

Depois, crie os dados iniciais (locais e o usuário administrador):

```bash
npm run seed
```

Antes, defina no backend/.env as variáveis `SEED_ADMIN_*` (ver .env.example).
A senha do admin (`SEED_ADMIN_SENHA`) é obrigatória e precisa ter de 15 a
128 caracteres. Para entrar como admin, use `SEED_ADMIN_EMAIL` ou
`SEED_ADMIN_MATRICULA` com essa senha. O seed pode ser executado de novo
sem duplicar dados.


Se você já possui tabelas criadas manualmente e ainda não tem histórico
do Prisma, confira o procedimento de baseline antes de aplicar migrations.

O arquivo migration.sql de uma migration já aplicada deve ser preservado.
Correções posteriores entram em novas migrations.

Referência: [migrations do Prisma 7](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production).


**5. Rode o backend** (porta 3000):

```bash
cd backend
npm run dev
```

O backend importa o Prisma Client gerado em TypeScript, por isso roda com `tsx` (`npm run dev`), e não com `node server.js`.

**6. Em outro terminal, rode o frontend** (porta 5173):

```bash
cd frontend
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

**Atualizar versões das dependências intencionalmente**

Para consultar versões disponíveis, execute dentro de frontend ou backend:

```bash
npm outdated
```

Para atualizar respeitando os intervalos definidos no package.json:

```bash
npm update
```

Revise as alterações no package-lock.json e verifique o funcionamento
antes de fazer commit. Dependências com versão exata permanecem fixadas.

Ao atualizar o Prisma, mantenha prisma, @prisma/client e
@prisma/adapter-mariadb na mesma versão e gere o client novamente.

**Parar o banco**

Dentro de backend:

```bash
docker compose down
```

O volume mantém os dados entre as execuções.
A opção -v também remove o volume e seus dados; não a utilize para
apenas parar o ambiente.

**Depois de atualizar a sua branch com a `main` (git pull / merge)**

Quando chegam mudanças de outra pessoa, rode dentro de `backend`:

```bash
npm install
npx prisma migrate deploy
npx prisma generate
```

- `npm install` instala bibliotecas novas (ex.: o `argon2` entrou em 21/10).
- `migrate deploy` aplica no seu banco as mudanças de tabela que ainda não rodaram.
- `generate` atualiza o Prisma Client para o schema novo.

Confira também se o seu `backend/.env` tem todas as variáveis do `.env.example`
(ex.: `CORS_ORIGINS` e `SEED_ADMIN_*` foram adicionadas em 25/10). Se o banco
ainda não tiver os locais e o admin, rode `npm run seed`. No frontend, rode
`npm install` dentro de `frontend` quando o `package.json` dele mudar.

**Contas para testar**

- Admin: o criado pelo seed (`SEED_ADMIN_EMAIL` ou `SEED_ADMIN_MATRICULA` com `SEED_ADMIN_SENHA`).
- Aluno: crie pela tela de Cadastro (`/cadastro`), com e-mail `@edu.unifor.br`.

## Fluxo de trabalho no Git

- `main` — branch estável, integrada pelo time.
- Cada integrante trabalha na própria branch (ex.: `francisco-dev`), dá push e integra via PR/merge.
- Antes de começar algo novo, atualize sua branch com a `main` e rode os comandos da seção acima.
- Ao terminar uma entrega, atualize `specs/status.md` e registre em `specs/historico.md` o que mudou e por quê.

## Status atual

Veja [`specs/status.md`](./specs/status.md) para o progresso tela a tela e [`specs/historico.md`](./specs/historico.md) para o que foi feito em cada entrega.

Resumo (25/10/2026): todas as telas essenciais têm o visual pronto. Estão ligadas ao banco de verdade: Cadastro, Login, Sair da conta, Configurações e o nome do usuário na Navbar e na Home. Esportes e inscrições ainda usam dados de mentira (mocks) e são a próxima etapa.

## Glossário rápido (para quem está começando no backend)

| Termo | O que é |
|---|---|
| Frontend | As telas (pasta `frontend`, React). |
| Backend | O servidor que recebe os pedidos das telas, aplica as regras e fala com o banco (pasta `backend`, Express). |
| API / rota | Um endereço do backend que a tela chama, ex.: `POST /api/auth/login`. |
| Banco de dados | Onde os dados ficam guardados de verdade (MySQL, rodando no Docker). |
| Mock | Dado de mentira escrito no código para a tela funcionar antes do backend existir (`frontend/src/mocks`). |
| Migration | Arquivo com uma mudança na estrutura do banco (criar tabela, adicionar coluna). Cada pessoa aplica no próprio banco com `npx prisma migrate deploy`. |
| Seed | Script que coloca dados iniciais no banco (locais e admin): `npm run seed`. |
| Prisma | Biblioteca que o backend usa para ler e gravar no banco. |
| Hash (Argon2) | Forma embaralhada de guardar a senha: o banco nunca guarda a senha original. |
| Sessão / cookie | Como o backend lembra quem está logado entre um pedido e outro. |
| CORS | Lista de endereços de frontend que o backend aceita. |
| `.env` | Arquivo local com senhas e configurações da sua máquina; nunca vai para o GitHub (o `.env.example` mostra o formato). |
| Middleware | Função que roda antes da rota, ex.: `autenticar` (exige login) e `exigirAdmin` (exige perfil admin). |
| PR (pull request) | Pedido no GitHub para juntar as mudanças de uma branch na `main`. |
