const express = require('express');
const { doEsporte, enviar, pendentes, decidir } = require('./avaliacao.controller.cjs');
const autenticar = require('../../middlewares/autenticar.cjs');
const exigirAdmin = require('../../middlewares/exigir-admin.cjs');

const router = express.Router();
// Admin (antes das outras, para "pendentes" não ser lido como id)
router.get('/pendentes', autenticar, exigirAdmin, pendentes);
// Avaliações de um esporte; o aluno envia a própria pela identidade da sessão
router.get('/esporte/:idEsporte', autenticar, doEsporte);
router.put('/esporte/:idEsporte', autenticar, enviar);
router.patch('/:idEsporte/:idAluno', autenticar, exigirAdmin, decidir);
module.exports = router;
