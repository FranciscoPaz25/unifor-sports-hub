# Rotas de API — Unifor Sports Hub

> **Status: nenhuma rota real implementada ainda.** O backend hoje só tem uma rota de teste (`GET /api/teste`). As rotas abaixo são o planejamento, na ordem em que entram (ver `status.md`).

## Autenticação

| Método | Rota | O que faz | Status |
|---|---|---|---|
| POST | `/auth/cadastro` | Cria um novo aluno (RF02.12), validando e-mail institucional e campos obrigatórios | não implementada |
| POST | `/auth/login` | Valida credenciais (RF01.9), identifica o perfil (RF01.11) e retorna os dados do usuário autenticado | não implementada |

## Esportes

| Método | Rota | O que faz | Status |
|---|---|---|---|
| GET | `/esportes` | Lista os esportes do catálogo (RF05) | não implementada |
| GET | `/esportes/:id` | Detalhes de um esporte (RF08) | não implementada |
| POST | `/esportes` | Administrador cadastra um novo esporte (RF20) | não implementada |

## Inscrições em esporte

| Método | Rota | O que faz | Status |
|---|---|---|---|
| POST | `/inscricoes-esporte` | Aluno solicita inscrição em um esporte, entra como `em_analise` (RF09) | não implementada |
| GET | `/inscricoes-esporte?usuario_id=` | Lista as inscrições do aluno logado (RF10) | não implementada |
| GET | `/inscricoes-esporte/pendentes` | Lista inscrições `em_analise` para o administrador decidir (RF23) | não implementada |
| PATCH | `/inscricoes-esporte/:id` | Administrador aceita ou rejeita uma inscrição (RF23.8) | não implementada |

## Configurações

| Método | Rota | O que faz | Status |
|---|---|---|---|
| GET | `/usuarios/:id` | Dados do perfil para a tela Configurações (RF17) | não implementada |
| PUT | `/usuarios/:id` | Edita dados do perfil / troca senha (RF17) | não implementada |

## Pendência de identificação das inscrições

A tabela inscricao_modalidade utiliza chave composta por modalidade e usuário,
sem um campo id isolado. Antes de implementar PATCH /inscricoes-esporte/:id,
definir como a API identificará essa inscrição.

O usuário das operações de aluno deve ser obtido da sessão autenticada.
Parâmetros enviados pelo cliente não substituem a validação de autorização.

---

**Convenção combinada:** todas as rotas reais ficam sob `/api/...` no Express (ex.: `/api/auth/login`), conforme a rota de teste já existente (`GET /api/teste`). Ajustar a tabela acima com o prefixo quando as rotas forem criadas.
