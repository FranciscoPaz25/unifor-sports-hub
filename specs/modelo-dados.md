# Modelo de dados — Unifor Sports Hub

> Última atualização: 25/10/2026.
> Banco escolhido: MySQL 8.4. ORM: Prisma 7.10.1.
> Express utiliza Prisma nas operações de autenticação, consulta do próprio perfil, edição de nome/e-mail e troca de senha. As demais integrações continuam pendentes.

## Arquivos de referência

- `backend/prisma/schema.prisma`: modelos, tipos e relacionamentos.
- `backend/prisma/migrations/`: SQL das migrations, incluindo constraints CHECK.
- `backend/prisma.config.ts`: configuração do Prisma e leitura de DATABASE_URL.
- `backend/compose.yaml`: configuração do MySQL local.
- `backend/lib/prisma.cjs`: instância compartilhada do Prisma Client com adapter MariaDB para MySQL.

Os nomes abaixo correspondem aos nomes físicos usados no banco.

## Tabelas

| Tabela | Finalidade | Chave primária |
|---|---|---|
| usuario | Alunos e administradores | idUsuario |
| local | Locais das atividades | idLocal |
| modalidade_esportiva | Modalidades oferecidas | idModalidade |
| modalidade_dia | Dias da semana de cada modalidade | ModalidadeEsportiva_idModalidade + DiaSemana |
| inscricao_modalidade | Inscrições em modalidades | id (par modalidade + usuário é único) |
| avaliar | Avaliações de modalidades | Usuario_idAluno + ModalidadeEsportiva_idModalidade |
| evento | Eventos esportivos | idEvento |
| inscricao_evento | Participantes dos eventos | Usuario_idAluno + Evento_idEvento |

As chaves simples listadas acima são inteiras e autoincrementais.

## Campos e relacionamentos

### usuario

- idUsuario: identificador.
- Nome: nome do usuário.
- Matricula: VARCHAR(7), única.
- Email: VARCHAR(255), único.
- Senha: VARCHAR(255), destinado ao hash da senha.
- TipoUsuario: enum `admin` ou `aluno`.

O administrador não se cadastra pela interface.
A verificação da senha no login e a geração/verificação de hash na troca de senha estão implementadas com Argon2. O hash cabe no campo `Senha` atual; não foi necessário alterar o esquema para essa entrega.

As consultas públicas de perfil selecionam explicitamente `idUsuario`, `Nome`, `Email`, `Matricula` e `TipoUsuario`, sem `Senha`. O hash é consultado internamente somente nas operações que verificam credenciais.

O PUT de perfil atualiza apenas `Nome` e `Email`, identificando o registro pela sessão. A unicidade de `Email` no MySQL impede duplicação inclusive entre requisições concorrentes; o erro `P2002` é tratado como 409 nesse endpoint. O campo `TipoUsuario` não é editável nessa operação.

### Sessões da aplicação

As sessões não são uma tabela do MySQL nesta etapa. Um `Map` no processo do backend relaciona o identificador aleatório a `idUsuario` e `ultimaAtividade`. Cada usuário mantém uma sessão; o prazo é de 15 minutos de inatividade, verificado antes da renovação. Logout remove a sessão; trocar a senha invalida as sessões do usuário. Reiniciar o backend exige novo login.

Esse armazenamento não é compartilhado entre processos ou réplicas. Persistência e compartilhamento de sessões ficam fora do escopo atual.

### local

- idLocal: identificador.
- Nome: nome do local.
- Capacidade: capacidade do espaço.

Um local pode estar associado a várias modalidades e eventos.

### Dados iniciais (seed)

`backend/prisma/seed.cjs`, executado por `npm run seed` (`prisma db seed`), cria os seis locais usados nos mocks do frontend e um usuário `admin`. Os dados do admin vêm de `SEED_ADMIN_NOME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_MATRICULA` e `SEED_ADMIN_SENHA` no `backend/.env`; a senha é obrigatória (15 a 128 caracteres) e gravada só como hash Argon2. O seed pode ser repetido: locais com o mesmo nome e usuário com o mesmo e-mail ou matrícula são mantidos sem alteração.

### modalidade_esportiva

- idModalidade: identificador.
- Nome, Descricao, Categoria e Professor.
- Capacidade: quantidade máxima de participantes.
- HorarioInicio e HorarioFim: campos TIME.
- Usuario_idAdmin: referência a usuario.idUsuario.
- Local_idLocal: referência a local.idLocal.

Os dias são armazenados em modalidade_dia.
O modelo atual usa o mesmo intervalo de horários para todos os dias da modalidade.

Regras usadas pela API de esportes (25/10/2026):
- `Usuario_idAdmin` recebe o admin da sessão que criou o esporte.
- Vagas disponíveis = `Capacidade` − inscrições com status `confirmada` (inscrições `em_analise` não ocupam vaga).
- Nota média e total de avaliações consideram só `avaliar.Status = confirmada` (resenhas aprovadas).
- Horários trafegam como texto `HH:MM`; no banco são TIME, gravados como UTC para não sofrer fuso.
- Excluir uma modalidade apaga em cascata `modalidade_dia`, `inscricao_modalidade` e `avaliar` (FKs `ON DELETE CASCADE`).
- Não há coluna de imagem: Criar esporte mostra a pré-visualização, mas a imagem não é salva.

### modalidade_dia

- ModalidadeEsportiva_idModalidade: referência à modalidade.
- DiaSemana: inteiro entre 1 e 7.

A chave composta impede repetir o mesmo dia para uma modalidade.
Padrão adotado na API (25/10/2026): 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado, 7 = Domingo. A API devolve `dias` (números) e `diasSemana` (texto, ex.: "Segunda, Quarta e Sexta").

### inscricao_modalidade

- id: identificador autoincremento, chave primária (migration `20261025_inscricao_modalidade_id`). É o `:id` das rotas de inscrição e o `inscricao.id` do frontend.
- ModalidadeEsportiva_idModalidade: referência à modalidade.
- Usuario_idUsuario: referência ao usuário.
- status: enum `em_analise`, `confirmada` ou `cancelada`; padrão `em_analise`.
- data: data de criação, preenchida por padrão com o horário atual.

O índice único `inscricao_modalidade_UNIQUE` (modalidade + usuário) continua permitindo apenas um registro por usuário e modalidade.
Uma nova solicitação após cancelamento precisa ter seu comportamento definido (por exemplo, reaproveitar o registro voltando para `em_analise`).

### avaliar

- Usuario_idAluno: referência ao usuário.
- ModalidadeEsportiva_idModalidade: referência à modalidade.
- Nota: inteiro entre 1 e 5.
- Comentario: VARCHAR(255), opcional.
- Status: enum `em_analise`, `confirmada` ou `cancelada`; padrão `em_analise`.
- Data: data de criação, preenchida por padrão com o horário atual.

A chave composta permite uma avaliação por usuário e modalidade.

### evento

- idEvento: identificador.
- Nome e Descricao.
- DATA: data e horário do evento.
- Capacidade: quantidade máxima de participantes.
- Ativo: TINYINT, padrão 1.
- Local_idLocal: referência ao local.
- Usuario_idAdmin: referência ao usuário responsável.

### inscricao_evento

- Usuario_idAluno: referência ao usuário.
- Evento_idEvento: referência ao evento.
- Data: data de criação, preenchida por padrão com o horário atual.

A chave composta impede inscrições duplicadas.
A tabela não possui campo de status.

## Regras registradas nas migrations

- Capacidades de local, modalidade e evento devem ser positivas.
- Nota de avaliação deve estar entre 1 e 5.
- DiaSemana deve estar entre 1 e 7.
- O intervalo da modalidade deve começar a partir de 00:00:00,
  terminar antes de 24:00:00 e ter término posterior ao início.
- O banco aceita e-mails dos domínios unifor.br e edu.unifor.br.
- A migration de correção da matrícula define o padrão
  `^[0-9]{2}[1-2][0-9]{4}$`.

A aplicação da migration de correção deve ser confirmada no histórico do banco.
As constraints CHECK estão documentadas no SQL das migrations.

## Pendências de integração

- Implementar cadastro e recuperação de senha; scripts locais de preparação de contas não substituem esses endpoints.
- Alinhar a edição de e-mail por perfil: o banco aceita os dois domínios, mas o frontend restringe alunos a `@edu.unifor.br`. A regra no backend deve usar o perfil do banco, não o enviado pelo cliente.
- Validar permissões: as FKs para usuario não garantem o perfil admin ou aluno.
- Manter a validação de cadastro de aluno com domínio @edu.unifor.br.
- Definir armazenamento de imagens; imagem_url ainda não existe no modelo.
- Definir o comportamento de cancelamento de inscrição em evento.
- Implementar controle de vagas no backend, considerando requisições simultâneas.
