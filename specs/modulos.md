# Módulos do MVP — Unifor Sports Hub

> Agrupamento por módulo funcional, seguindo o fluxo coração do MVP (ver `decisoes.md` / seção 13 do contexto geral): Aluno se cadastra → vê esportes → se inscreve → fica "Em análise" → administrador aprova ou rejeita → aluno vê confirmado.

## 1. Autenticação

**Objetivo:** permitir que alunos criem conta e que alunos e administradores entrem no sistema, sendo redirecionados para a Home do perfil correto.

**Telas:**
- RF01 — Login (compartilhada aluno/admin)
- RF02 — Cadastro (só aluno)
- RF03 — Esqueceu a senha (só aluno)

**Depende de:** tabela `usuario`.

## 2. Esportes

**Objetivo:** permitir que o aluno descubra as modalidades esportivas oferecidas, veja detalhes e vagas, e que o administrador cadastre novas modalidades.

**Telas:**
- RF05 — Esportes (catálogo)
- RF08 — Detalhes do esporte (varia: Aluno vê "Inscrever-se", ADM vê "Excluir")
- RF20 — Criar esporte (só ADM)

**Depende de:** tabelas `modalidade_esportiva`, `modalidade_dia` e `local`.

## 3. Inscrições (esporte)

**Objetivo:** permitir que o aluno solicite inscrição em um esporte e acompanhe o status (Em análise / Confirmada / Cancelada), e que o administrador aprove ou rejeite cada solicitação.

**Telas:**
- RF09 — Popup enviar inscrição no esporte (só aluno)
- RF10 — Minhas inscrições (só aluno)
- RF23 — Gerenciar inscrições (só ADM)

**Depende de:** tabela `inscricao_modalidade` (relaciona `usuario` + `modalidade_esportiva`).

## 4. Gerência (ADM)

**Objetivo:** central de administração — menu com acesso a criar esporte, aceitar resenhas e gerenciar inscrições.

**Telas:**
- RF19 — Gerência (menu)

**Depende de:** nenhuma tabela própria; agrega os outros módulos.

## 5. Configurações

**Objetivo:** permitir que qualquer usuário (aluno ou ADM) veja/edite seus dados de perfil e saia da conta.

**Telas:**
- RF17 — Configurações (compartilhada)
- RF18 — Popup sair da conta (compartilhada)

**Depende de:** tabela `usuario`.

---

### Fora do MVP essencial (ver `status.md` para tratamento)
- Resenhas (RF12, RF13, RF21) — secundário, pode usar dado mockado.
- Busca/filtros (RF06, RF07) — secundário, pode usar dado mockado.
- Eventos (RF14, RF15, RF16, RF22) — se sobrar tempo, pode ficar só visual.
