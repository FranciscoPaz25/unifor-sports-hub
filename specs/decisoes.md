# Decisões de design fixas — Unifor Sports Hub

> Regras que valem para todas as telas, atuais e futuras. Copiado/organizado a partir do histórico de decisões do projeto (14/10/2026). Se uma tela nova contrariar algo aqui, é exceção — não vira regra sem decisão explícita.

## Navegação

- **Navbar do Aluno:** Home | Esportes | Minhas inscrições | Eventos | Configurações. O item ativo depende da seção (ex.: em telas de esportes, "Esportes" fica ativo).
- **Navbar do ADM:** Home | Eventos | Gerência | Configurações.
- Navbar mostra logotipo (sem subtítulo institucional), avatar e nome do usuário — **sem cargo** (nada de "Estudante Atleta" ou similares).
- Sem sino de notificações, sem seta de voltar dentro da navbar, sem subtítulos abaixo dos títulos de seção.

## Padrões visuais

- Barra de busca padrão: campo de busca + botão "Filtros" + botão "Buscar" (aparece em Home, Esportes, Resultados de busca).
- Imagens dos cards são sempre genéricas (nunca fotos reais).
- Tag de vagas padronizada como **"[n] vagas disponíveis"** — nunca "restantes" nem "últimas vagas".
- Cards de esporte: imagem genérica, nome, local, vagas e botão "Inscrever-se". Na tela de resultados de busca também mostram dias/horário e nota em estrelas.
- Cards de evento: apenas data, nome, local e horário (sem categoria, descrição, status ou botão na lista da Home).
- Cor primária: azul institucional Unifor `#003DA5` (ver manual de marca em unifor.br/central-de-marca para confirmar o hex oficial).
- Fundo branco/cinza claro, cantos arredondados, sombras leves, tipografia sans-serif moderna.

## Regras de negócio

- **ADM não tem tela de cadastro** — o acesso dele é criado direto no banco de dados.
- **Fluxo de inscrição em esporte:** aluno solicita → status `em_analise` (tag amarela) → administrador aceita ou rejeita pela tela de Gerenciar inscrições (RF23) → card some da lista do ADM e o status do aluno atualiza em Minhas Inscrições (RF10).
- Não existe confirmação automática de inscrição em esporte — toda inscrição nasce `em_analise`.
- Cancelamento de inscrição (pelo aluno, em esporte ou evento confirmado) age imediatamente, sem popup de confirmação.
- "Excluir" (ações do ADM em esporte/evento) age direto, sem popup de confirmação.

## Textos de erro padronizados

- Login inválido: **"E-mail/matrícula ou senha inválidos"**
- Cadastro, e-mail fora do domínio institucional: **"Use seu e-mail institucional (@edu.unifor.br)"**
- Cadastro, senha e confirmação não batem: **"Erro ao confirmar senha. Verifique os padrões solicitados."**
- Inscrição em esporte recusada (já inscrito ou vagas esgotadas): **"Erro, verifique se você já está inscrito no esporte ou se as vagas acabaram"**

## O que NÃO existe (já descartado em telas anteriores, não reintroduzir)

- Checkbox "Lembrar este dispositivo" no login.
- Login com sistemas externos ("ou acesse com...").
- Tagline institucional abaixo do logotipo (variações como "PORTAL DO ATLETA & COMUNIDADE", "DIVISÃO DE ATIVIDADES DESPORTIVAS", "CAMPUS FORTALEZA").
- Seção "Modalidades mais populares" na Home.
- Botão "Ver todos os eventos" na Home.
- Badges extras no perfil do administrador (ex.: "ADMINISTRADOR", "DAD", "Gestão").
