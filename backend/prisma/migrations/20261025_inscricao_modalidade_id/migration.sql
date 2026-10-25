-- inscricao_modalidade passa a ter uma coluna id autoincremento como chave
-- primária, usada pela API (PATCH /api/inscricoes-esporte/:id) e pelo frontend
-- (inscricao.id). O par modalidade + usuário continua único: o aluno tem no
-- máximo uma inscrição por modalidade. Esse índice único também atende a FK
-- fk_inscricao_modalidade_modalidade, que antes usava a chave composta.
-- Linhas já existentes recebem um id automaticamente.
ALTER TABLE `inscricao_modalidade`
  ADD UNIQUE INDEX `inscricao_modalidade_UNIQUE`(`ModalidadeEsportiva_idModalidade`, `Usuario_idUsuario`),
  DROP PRIMARY KEY,
  ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT FIRST,
  ADD PRIMARY KEY (`id`);
