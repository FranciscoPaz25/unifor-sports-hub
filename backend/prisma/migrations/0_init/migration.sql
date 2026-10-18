-- CreateTable
CREATE TABLE `avaliar` (
    `Usuario_idAluno` INTEGER NOT NULL,
    `ModalidadeEsportiva_idModalidade` INTEGER NOT NULL,
    `Comentario` VARCHAR(255) NULL,
    `Status` ENUM('em_analise', 'confirmada', 'cancelada') NOT NULL DEFAULT 'em_analise',
    `Data` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Nota` INTEGER NOT NULL,

    INDEX `fk_id_modalidade_idx`(`ModalidadeEsportiva_idModalidade`),
    PRIMARY KEY (`Usuario_idAluno`, `ModalidadeEsportiva_idModalidade`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `evento` (
    `idEvento` INTEGER NOT NULL AUTO_INCREMENT,
    `DATA` DATETIME(0) NOT NULL,
    `Capacidade` INTEGER NOT NULL,
    `Ativo` TINYINT NOT NULL DEFAULT 1,
    `Nome` VARCHAR(255) NOT NULL,
    `Descricao` TEXT NOT NULL,
    `Local_idLocal` INTEGER NOT NULL,
    `Usuario_idAdmin` INTEGER NOT NULL,

    INDEX `fk_idAdmin_idx`(`Usuario_idAdmin`),
    INDEX `fk_idLocal_idx`(`Local_idLocal`),
    PRIMARY KEY (`idEvento`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `inscricao_evento` (
    `Usuario_idAluno` INTEGER NOT NULL,
    `Evento_idEvento` INTEGER NOT NULL,
    `Data` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_idEvento_idx`(`Evento_idEvento`),
    PRIMARY KEY (`Usuario_idAluno`, `Evento_idEvento`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `inscricao_modalidade` (
    `status` ENUM('em_analise', 'confirmada', 'cancelada') NOT NULL DEFAULT 'em_analise',
    `data` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ModalidadeEsportiva_idModalidade` INTEGER NOT NULL,
    `Usuario_idUsuario` INTEGER NOT NULL,

    INDEX `fk_id_usuario_idx`(`Usuario_idUsuario`),
    PRIMARY KEY (`ModalidadeEsportiva_idModalidade`, `Usuario_idUsuario`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `local` (
    `idLocal` INTEGER NOT NULL AUTO_INCREMENT,
    `Nome` VARCHAR(255) NOT NULL,
    `Capacidade` INTEGER NOT NULL,

    PRIMARY KEY (`idLocal`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `modalidade_dia` (
    `ModalidadeEsportiva_idModalidade` INTEGER NOT NULL,
    `DiaSemana` TINYINT NOT NULL,

    PRIMARY KEY (`ModalidadeEsportiva_idModalidade`, `DiaSemana`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `modalidade_esportiva` (
    `idModalidade` INTEGER NOT NULL AUTO_INCREMENT,
    `Nome` VARCHAR(255) NOT NULL,
    `Descricao` TEXT NOT NULL,
    `Categoria` VARCHAR(255) NOT NULL,
    `Capacidade` INTEGER NOT NULL,
    `Professor` VARCHAR(255) NOT NULL,
    `HorarioFim` TIME(0) NOT NULL,
    `Usuario_idAdmin` INTEGER NOT NULL,
    `Local_idLocal` INTEGER NOT NULL,
    `HorarioInicio` TIME(0) NOT NULL,

    INDEX `fk_idAdmin_idx`(`Usuario_idAdmin`),
    INDEX `fk_idLocal_idx`(`Local_idLocal`),
    PRIMARY KEY (`idModalidade`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `idUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `Matricula` VARCHAR(7) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `Senha` VARCHAR(255) NOT NULL,
    `TipoUsuario` ENUM('admin', 'aluno') NOT NULL,
    `Nome` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `matricula_UNIQUE`(`Matricula`),
    UNIQUE INDEX `email_UNIQUE`(`Email`),
    PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- AddForeignKey
ALTER TABLE `avaliar` ADD CONSTRAINT `fk_aluno_id` FOREIGN KEY (`Usuario_idAluno`) REFERENCES `usuario`(`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `avaliar` ADD CONSTRAINT `fk_id_modalidade` FOREIGN KEY (`ModalidadeEsportiva_idModalidade`) REFERENCES `modalidade_esportiva`(`idModalidade`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evento` ADD CONSTRAINT `fk_evento_admin` FOREIGN KEY (`Usuario_idAdmin`) REFERENCES `usuario`(`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evento` ADD CONSTRAINT `fk_evento_local` FOREIGN KEY (`Local_idLocal`) REFERENCES `local`(`idLocal`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inscricao_evento` ADD CONSTRAINT `fk_idAluno` FOREIGN KEY (`Usuario_idAluno`) REFERENCES `usuario`(`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inscricao_evento` ADD CONSTRAINT `fk_idEvento` FOREIGN KEY (`Evento_idEvento`) REFERENCES `evento`(`idEvento`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inscricao_modalidade` ADD CONSTRAINT `fk_id_usuario` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `usuario`(`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inscricao_modalidade` ADD CONSTRAINT `fk_inscricao_modalidade_modalidade` FOREIGN KEY (`ModalidadeEsportiva_idModalidade`) REFERENCES `modalidade_esportiva`(`idModalidade`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `modalidade_dia` ADD CONSTRAINT `fk_modalidade_dia_modalidade` FOREIGN KEY (`ModalidadeEsportiva_idModalidade`) REFERENCES `modalidade_esportiva`(`idModalidade`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `modalidade_esportiva` ADD CONSTRAINT `fk_modalidade_admin` FOREIGN KEY (`Usuario_idAdmin`) REFERENCES `usuario`(`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `modalidade_esportiva` ADD CONSTRAINT `fk_modalidade_local` FOREIGN KEY (`Local_idLocal`) REFERENCES `local`(`idLocal`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Regras existentes no banco que o Prisma não gerou.

ALTER TABLE `avaliar`
  ADD CONSTRAINT `chr_avaliar_nota`
  CHECK (`Nota` BETWEEN 1 AND 5);

ALTER TABLE `evento`
  ADD CONSTRAINT `chk_evento_capacidade`
  CHECK (`Capacidade` > 0);

ALTER TABLE `local`
  ADD CONSTRAINT `chk_local_capacidade`
  CHECK (`Capacidade` > 0);

ALTER TABLE `modalidade_dia`
  ADD CONSTRAINT `chk_modalidade_dia_semana`
  CHECK (`DiaSemana` BETWEEN 1 AND 7);

ALTER TABLE `modalidade_esportiva`
  ADD CONSTRAINT `chk_modalidade_capacidade`
  CHECK (`Capacidade` > 0),
  ADD CONSTRAINT `chk_modalidade_horario`
  CHECK (
    `HorarioInicio` >= '00:00:00'
    AND `HorarioFim` < '24:00:00'
    AND `HorarioFim` > `HorarioInicio`
  );

ALTER TABLE `usuario`
  ADD CONSTRAINT `chk_email_institucional`
  CHECK (
    REGEXP_LIKE(
      `Email`,
      _utf8mb4'^[A-Za-z0-9._%+-]+@(unifor\\.br|edu\\.unifor\\.br)$'
    )
  ),
  ADD CONSTRAINT `chk_matricula_unifor`
  CHECK (
    REGEXP_LIKE(
      `Matricula`,
      _utf8mb4'[0-9]{2}[1-2][0-9]{4}$'
    )
  );