const express = require('express');
const { solicitar, minhas, detalharMinha, cancelar, pendentes, decidir } = require('./inscricao.controller.cjs');
const autenticar = require('../../middlewares/autenticar.cjs');
const exigirAdmin = require('../../middlewares/exigir-admin.cjs');

const router = express.Router();
// Aluno: só enxerga e altera as próprias inscrições (identidade da sessão)
router.get('/', autenticar, minhas);
router.post('/', autenticar, solicitar);
// Admin (antes de /:id, para "pendentes" não ser lido como id)
router.get('/pendentes', autenticar, exigirAdmin, pendentes);
router.get('/:id', autenticar, detalharMinha);
router.patch('/:id/cancelar', autenticar, cancelar);
router.patch('/:id', autenticar, exigirAdmin, decidir);
module.exports = router;
