# Modelo de dados — Unifor Sports Hub

> **Status: a definir.** O banco físico ainda não foi criado nem escolhido (MySQL vs PostgreSQL). As 7 tabelas abaixo são as que foram mapeadas a partir dos requisitos funcionais fechados; os campos listados são os que já aparecem nas telas/RFs. Falta formalizar tipos, chaves e constraints antes de criar o banco de verdade.

## 1. usuarios

Guarda aluno e administrador na mesma tabela (um campo distingue o perfil — RF01.11 identifica automaticamente a partir das credenciais).

| Campo | Origem / observação |
|---|---|
| id | chave primária |
| nome_completo | RF02.3 |
| email | RF02.4 — institucional, domínio `@edu.unifor.br` (RF02.5) |
| matricula | RF02.6 |
| senha_hash | RF02.7 — nunca salvar em texto puro |
| tipo | `aluno` ou `admin` — ADM não se cadastra pela tela (seção 1 do contexto geral), acesso criado direto no banco |

## 2. esportes

| Campo | Origem / observação |
|---|---|
| id | chave primária |
| nome | RF20 — Criar esporte |
| imagem_url | RF20.3 — upload PNG/JPG/WEBP até 5MB |
| local | — |
| vagas_totais | usado para calcular "[n] vagas disponíveis" |
| criado_por | FK → usuarios.id (admin que cadastrou) |

## 3. esporte_horarios

Um esporte pode ter mais de um horário/dia da semana (RF09.5 mostra "dias da semana" no popup de inscrição).

| Campo | Origem / observação |
|---|---|
| id | chave primária |
| esporte_id | FK → esportes.id |
| dia_semana | — |
| horario | — |

## 4. inscricoes_esporte

| Campo | Origem / observação |
|---|---|
| id | chave primária |
| usuario_id | FK → usuarios.id |
| esporte_id | FK → esportes.id |
| status | `em_analise` \| `confirmada` \| `cancelada` (RF10, RF23) |
| criado_em | para ordenar "mais recente para o mais antigo" (RF10) |

## 5. avaliacoes

Secundário no MVP (pode ficar mockado) — mapeado aqui para não esquecer.

| Campo | Origem / observação |
|---|---|
| id | chave primária |
| usuario_id | FK → usuarios.id |
| esporte_id | FK → esportes.id |
| nota | RF13 |
| comentario | RF13 |
| status | pendente de aprovação / aprovada (RF21) |

## 6. eventos

Se sobrar tempo no MVP (seção 13) — estrutura espelha `esportes`.

| Campo | Origem / observação |
|---|---|
| id | chave primária |
| nome | RF22 |
| data | RF22 |
| local | RF22 |
| horario | — |
| vagas_totais | — |
| criado_por | FK → usuarios.id |

## 7. inscricoes_evento

Espelha `inscricoes_esporte`.

| Campo | Origem / observação |
|---|---|
| id | chave primária |
| usuario_id | FK → usuarios.id |
| evento_id | FK → eventos.id |
| status | `confirmada` (eventos não têm "Em análise" — RF10 nota 11) |

---

**Pendências antes de criar o banco de verdade:**
- Escolher MySQL ou PostgreSQL.
- Definir tipos exatos de cada campo (VARCHAR com tamanho, ENUM vs VARCHAR pra status, etc.).
- Definir se `senha_hash` usa bcrypt ou outra lib, e em qual camada (backend) o hash é gerado.
