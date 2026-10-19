ALTER TABLE `usuario`
  DROP CHECK `chk_matricula_unifor`,
  ADD CONSTRAINT `chk_matricula_unifor`
    CHECK (
      REGEXP_LIKE(
        `Matricula`,
        _utf8mb4'^[0-9]{2}[1-2][0-9]{4}$'
      )
    );