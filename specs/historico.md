# Histórico de entregas — Unifor Sports Hub

> Registro do que entrou na `main`, quando e por quê, para quem chega agora ter o contexto. O estado atual tela a tela fica em `status.md`; as regras fixas, em `decisoes.md`. Entradas mais recentes primeiro.

## 25/10/2026 — Módulo de esportes (telas 04, 05, 08 e 20)

**O que mudou**
- Backend: `backend/modules/esportes/` com `GET /api/esportes`, `GET /api/esportes/:id`, `POST /api/esportes` e `DELETE /api/esportes/:id` (criar e excluir só para admin), e `GET /api/locais`.
- Telas Home (esportes em destaque), Esportes, Detalhes do esporte e Criar esporte deixaram de usar `mocks/esportes.js`. O campo Local de Criar esporte virou uma lista com os locais do banco.
- `frontend/src/utils/api.js` ganhou `chamarApi` e `mensagemDeErro`, para as telas chamarem a API sem repetir código.
- `server.js` aceita `PORT` no `.env` (padrão 3000).

**Decisões tomadas:** dias da semana 1 = Segunda … 7 = Domingo; vagas descontam só inscrições confirmadas; nota conta só avaliações aprovadas; a imagem do esporte ainda não é salva (não há coluna no banco).

**Por quê:** segundo passo do fluxo central — o aluno precisa ver os esportes reais para se inscrever, e o admin precisa cadastrá-los.

**Transição:** o popup de inscrição e as telas de inscrição ainda usam mocks. Até o módulo de inscrições, uma inscrição feita num esporte do banco pode não aparecer certa em Minhas inscrições.

## 25/10/2026 — Cadastro de aluno (tela 02, PR #9)

**O que mudou**
- Nova rota `POST /api/auth/cadastro` (`backend/modules/auth/`): valida os dados, cria o usuário sempre como `aluno`, salva a senha só como hash Argon2 e recusa e-mail ou matrícula repetidos (409).
- A tela de Cadastro deixou de ser `console.log`: envia para a API, mostra os erros do backend e, ao concluir, leva ao Login com a mensagem "Conta criada. Faça login para continuar.".
- Senha do cadastro passou a seguir a regra do projeto (15 a 128 caracteres), com a dica "Mínimo de 15 caracteres." na tela.

**Por quê:** primeiro passo do fluxo central do MVP (aluno se cadastra → vê esportes → se inscreve). Sem cadastro, só existiam contas criadas à mão no banco.

## 25/10/2026 — Autorização de admin e redirecionamento por perfil (PR #8)

**O que mudou**
- Backend: middleware `backend/middlewares/exigir-admin.cjs`. Usado depois de `autenticar`, consulta no banco se o usuário é admin e responde 403 se não for.
- Frontend: componente `ExigirPerfil` separa telas de aluno e de admin. Quem abre tela do outro perfil volta para a própria home. `/esportes` e `/esportes/:id` são compartilhadas.
- Login leva o admin para `/admin/home` e o aluno para `/home` (`frontend/src/utils/perfil.js`).

**Por quê:** antes, qualquer pessoa logada (inclusive aluno) abria as telas de admin digitando o endereço, e o admin caía na home do aluno. Esconder telas não basta como proteção, por isso a checagem principal fica no backend.

## 25/10/2026 — Banco: `id` nas inscrições e seed (PR #7)

**O que mudou**
- Migration `20261025_inscricao_modalidade_id`: a tabela `inscricao_modalidade` ganhou a coluna `id` (número único da inscrição). O par modalidade + aluno continua único.
- Seed (`npm run seed` no backend): cria os seis locais usados nos mocks e um usuário admin, com dados lidos de `SEED_ADMIN_*` no `backend/.env`.

**Por quê:** a tela Gerenciar inscrições precisa identificar cada inscrição por um número para aceitar ou rejeitar. Sem locais e sem admin no banco, não dá para criar esporte nem entrar como admin.

## 25/10/2026 — Ajustes da revisão do PR #5 (PR #6)

**O que mudou**
- Endereço da API centralizado em `frontend/src/utils/api.js` (`VITE_API_URL`, padrão `http://localhost:3000`). Antes estava fixo no IP de um integrante (`192.168.15.7`), e o login só funcionava naquela máquina.
- Origens do CORS lidas de `CORS_ORIGINS` no `backend/.env` (padrão `http://localhost:5173`).
- `tratar-erros.cjs` passou a registrar o erro completo no terminal do backend.
- Correções em `status.md` perdidas no merge e cabeçalho da Home.

**Por quê:** permitir que qualquer integrante rode o projeto no próprio computador sem editar código.

## 21/10/2026 — Autenticação por sessão e perfil (PR #5, branch `db-base-mvp`)

**O que mudou**
- Login, logout e sessão em cookie (`unifor_sid`), senha verificada com Argon2.
- Configurações conectadas: ver e editar nome/e-mail e trocar senha (`/api/usuarios/me`).
- `RotaProtegida` no frontend: páginas internas só abrem com sessão válida.

**Por quê:** base de tudo o que exige saber quem é o usuário.

## Até 19/10/2026 — Telas visuais (PRs #1 a #4)

Todas as telas essenciais do MVP feitas em React com dados de mentira (mocks), mais Aceitar resenhas e Criar evento. Banco MySQL + Prisma configurado com o modelo físico.

---

## Questões em aberto

- Nova inscrição depois de um cancelamento: hoje o par modalidade + aluno é único, então a segunda solicitação precisa reaproveitar o registro (ex.: voltar para `em_analise`). Definir antes de implementar inscrições.
- Inscrição rejeitada pelo admin vira `cancelada`, igual ao cancelamento do aluno. Se o aluno precisar ver "Rejeitada", é preciso um novo status (migration).
- Navbar do admin: o código mostra "Esportes", mas `decisoes.md` lista só Home · Eventos · Gerência · Configurações. Confirmar qual vale.
- `avaliar.Status` usa `em_analise/confirmada/cancelada`; para resenhas talvez `aprovada/rejeitada` faça mais sentido. Confirmar antes de ligar a tela 21.
