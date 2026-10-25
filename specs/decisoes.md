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

## Autenticação e perfil — decisões de 21/10/2026

- Login aceita e-mail ou matrícula como identificador; credenciais são verificadas no backend com Argon2.
- Senhas são preservadas como digitadas, sem `trim`. O banco armazena somente o hash; ele não é retornado nas respostas públicas.
- Sessões ficam em memória nesta etapa, sem tabela adicional. Há uma sessão por usuário; novo login invalida a anterior. Reiniciar o backend exige novo login.
- Expiração após 15 minutos sem requisição autenticada válida. O backend calcula a última atividade; verifica a expiração antes de renovar. Cliques sem requisição não renovam a sessão.
- O identificador de sessão usa 32 bytes aleatórios criptográficos, enviados em cookie `unifor_sid` com `HttpOnly`, `SameSite=Lax`, `Path=/` e `Secure` em produção. Não há persistência por `maxAge` fixo.
- Logout invalida a sessão no servidor e limpa o cookie; responde 204 sem corpo mesmo quando a sessão não existe mais.
- Operações de perfil usam `/api/usuarios/me` e a identidade da sessão. O PUT exige nome e e-mail juntos; matrícula e tipo de usuário não são editáveis por ele.
- A troca usa `/api/usuarios/me/senha`, exige a senha atual e uma nova senha de 15 a 128 caracteres com confirmação. Sucesso invalida as sessões, limpa o cookie e exige novo login. A política nova não rejeita a senha atual apenas por ter menos de 15 caracteres.
- A consulta de perfil alimenta o estado compartilhado no frontend; nome e perfil não vêm mais do mock em Navbar, Home e Configurações. Salvar o perfil atualiza esse estado.
- Recuperação de senha e alinhamento do domínio por perfil na edição de perfil (backend) permanecem pendentes.

## Cadastro de aluno — decisões de 25/10/2026

- O cadastro cria sempre `TipoUsuario = aluno`; o admin continua sendo criado só pelo seed ou direto no banco.
- A senha do cadastro segue a mesma política da troca de senha: 15 a 128 caracteres, sem `trim`. A tela mostra "Mínimo de 15 caracteres." e mantém o indicador de força.
- O cadastro não faz login automático: leva ao Login, que mostra "Conta criada. Faça login para continuar." (RF02.13).

## Autorização por perfil — decisões de 25/10/2026

- Após o login, o aluno vai para `/home` e o admin para `/admin/home`.
- Telas de aluno (`/home`, `/minhas-inscricoes`, `/configuracoes`, `/eventos`) e de admin (`/admin/*`) são separadas; quem abre uma tela do outro perfil é levado à própria home, sem mensagem de erro.
- `/esportes` e `/esportes/:id` são compartilhadas (o admin chega por "Esportes" na navbar e vê "Excluir" nos detalhes).
- Rotas administrativas da API usam o middleware `exigirAdmin`, que lê o perfil do banco. Esconder telas no frontend não substitui essa checagem. `SameSite` e CORS não são uma garantia completa de proteção contra CSRF; essa proteção e a limitação de tentativas ainda precisam ser concluídas antes de uso em produção.

## Textos de erro padronizados

- Login inválido: **"Identificador ou senha inválidos."** — mesma mensagem para usuário inexistente ou senha incorreta, conforme o backend atual.
- Cadastro, e-mail fora do domínio institucional: **"Use seu e-mail institucional (@edu.unifor.br)"**
- Cadastro, matrícula fora do padrão: **"Matrícula inválida. São 7 dígitos: ano (2), semestre (1 ou 2) e número (4). Ex.: 2312345"**
- Cadastro, senha e confirmação não batem: **"Erro ao confirmar senha. Verifique os padrões solicitados."**
- Cadastro e troca de senha, tamanho fora do padrão: **"A senha deve ter entre 15 e 128 caracteres."**
- Cadastro, e-mail já usado: **"Este e-mail já está em uso."** · matrícula já usada: **"Esta matrícula já está cadastrada."**
- Acesso de aluno a rota de admin na API: **"Acesso restrito ao administrador."**
- Inscrição em esporte recusada (já inscrito ou vagas esgotadas): **"Erro, verifique se você já está inscrito no esporte ou se as vagas acabaram"**

## O que NÃO existe (já descartado em telas anteriores, não reintroduzir)

- Checkbox "Lembrar este dispositivo" no login.
- Login com sistemas externos ("ou acesse com...").
- Tagline institucional abaixo do logotipo (variações como "PORTAL DO ATLETA & COMUNIDADE", "DIVISÃO DE ATIVIDADES DESPORTIVAS", "CAMPUS FORTALEZA").
- Seção "Modalidades mais populares" na Home.
- Botão "Ver todos os eventos" na Home.
- Badges extras no perfil do administrador (ex.: "ADMINISTRADOR", "DAD", "Gestão").
