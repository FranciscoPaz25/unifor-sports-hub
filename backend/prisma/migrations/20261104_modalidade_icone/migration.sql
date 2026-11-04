-- Ícone padrão da modalidade, escolhido pelo admin em Criar esporte (decisão de 04/11/2026).
-- Guarda só o nome do ícone (ex.: 'futebol'); os desenhos ficam no frontend.
-- Modalidades já cadastradas recebem o ícone genérico.
ALTER TABLE `modalidade_esportiva`
  ADD COLUMN `Icone` VARCHAR(30) NOT NULL DEFAULT 'geral';
