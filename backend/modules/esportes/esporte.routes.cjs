const express = require('express');
const { listar, detalhar, criar, editar, excluir } = require('./esporte.controller.cjs');
const autenticar = require('../../middlewares/autenticar.cjs');
const exigirAdmin = require('../../middlewares/exigir-admin.cjs');

const router = express.Router();
router.get('/', autenticar, listar);
router.get('/:id', autenticar, detalhar);
router.post('/', autenticar, exigirAdmin, criar);
router.put('/:id', autenticar, exigirAdmin, editar);
router.delete('/:id', autenticar, exigirAdmin, excluir);
module.exports = router;
