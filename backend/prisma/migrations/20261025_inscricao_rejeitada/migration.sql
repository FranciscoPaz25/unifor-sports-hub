-- Novo status `rejeitada` para inscrições em modalidade: o admin recusou o pedido.
-- Antes a rejeição virava `cancelada`, igual ao cancelamento feito pelo aluno.
-- Valores existentes não mudam; o novo valor entra no fim do ENUM.
ALTER TABLE `inscricao_modalidade`
  MODIFY `status` ENUM('em_analise', 'confirmada', 'cancelada', 'rejeitada') NOT NULL DEFAULT 'em_analise';
