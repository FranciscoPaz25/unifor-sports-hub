# Modelo de dados — Unifor Sports Hub

> Última atualização: 18/10/2026.
> Banco escolhido: MySQL 8.4. ORM: Prisma 7.10.1.
> O banco local existe; a integração das rotas Express com o Prisma está pendente.

## Arquivos de referência

- `backend/prisma/schema.prisma`: modelos, tipos e relacionamentos.
- `backend/prisma/migrations/`: SQL das migrations, incluindo constraints CHECK.
- `backend/prisma.config.ts`: configuração do Prisma e leitura de DATABASE_URL.
- `backend/compose.yaml`: configuração do MySQL local.

Os nomes abaixo correspondem aos nomes físicos usados no banco.

## Tabelas

| Tabela | Finalidade | Chave primária |
|---|---|---|
| usuario | Alunos e administradores | idUsuario |
| local | Locais das atividades | idLocal |
| modalidade_esportiva | Modalidades oferecidas | idModalidade |
| modalidade_dia | Dias da semana de cada modalidade | ModalidadeEsportiva_idModalidade + DiaSemana |
| inscricao_modalidade | Inscrições em modalidades | ModalidadeEsportiva_idModalidade + Usuario_idUsuario |
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
A geração e verificação do hash ainda precisam ser implementadas no backend.

### local

- idLocal: identificador.
- Nome: nome do local.
- Capacidade: capacidade do espaço.

Um local pode estar associado a várias modalidades e eventos.

### modalidade_esportiva

- idModalidade: identificador.
- Nome, Descricao, Categoria e Professor.
- Capacidade: quantidade máxima de participantes.
- HorarioInicio e HorarioFim: campos TIME.
- Usuario_idAdmin: referência a usuario.idUsuario.
- Local_idLocal: referência a local.idLocal.

Os dias são armazenados em modalidade_dia.
O modelo atual usa o mesmo intervalo de horários para todos os dias da modalidade.

### modalidade_dia

- ModalidadeEsportiva_idModalidade: referência à modalidade.
- DiaSemana: inteiro entre 1 e 7.

A chave composta impede repetir o mesmo dia para uma modalidade.
A correspondência dos números com os dias da semana precisa ser padronizada na API.

### inscricao_modalidade

- ModalidadeEsportiva_idModalidade: referência à modalidade.
- Usuario_idUsuario: referência ao usuário.
- status: enum `em_analise`, `confirmada` ou `cancelada`; padrão `em_analise`.
- data: data de criação, preenchida por padrão com o horário atual.

A chave composta permite apenas um registro por usuário e modalidade.
Uma nova solicitação após cancelamento precisa ter seu comportamento definido.

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

- Conectar o Express ao Prisma Client.
- Implementar geração e verificação de hash de senha.
- Validar permissões: as FKs para usuario não garantem o perfil admin ou aluno.
- Manter a validação de cadastro de aluno com domínio @edu.unifor.br.
- Definir armazenamento de imagens; imagem_url ainda não existe no modelo.
- Definir o comportamento de cancelamento de inscrição em evento.
- Definir a identificação das inscrições na API, pois usam chaves compostas.
- Implementar controle de vagas no backend, considerando requisições simultâneas.