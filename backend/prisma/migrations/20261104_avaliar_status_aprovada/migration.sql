-- Status das avaliações (resenhas) passa a ser em_analise / aprovada / rejeitada (decisão de 04/11/2026).
-- Antes usava os mesmos nomes das inscrições (confirmada / cancelada).
-- 1) aceita os nomes antigos e os novos ao mesmo tempo; 2) converte; 3) remove os antigos.
ALTER TABLE `avaliar`
  MODIFY `Status` ENUM('em_analise', 'confirmada', 'cancelada', 'aprovada', 'rejeitada') NOT NULL DEFAULT 'em_analise';

UPDATE `avaliar` SET `Status` = 'aprovada' WHERE `Status` = 'confirmada';
UPDATE `avaliar` SET `Status` = 'rejeitada' WHERE `Status` = 'cancelada';

ALTER TABLE `avaliar`
  MODIFY `Status` ENUM('em_analise', 'aprovada', 'rejeitada') NOT NULL DEFAULT 'em_analise';
