const express = require('express')
const {obterMeuPerfil, atualizarMeuPerfilController, trocarMinhaSenha} = require('./usuario.controller.cjs')
const autenticar = require('../../middlewares/autenticar.cjs')

const router = express.Router()
router.get('/me', autenticar, obterMeuPerfil)
router.put('/me', autenticar, atualizarMeuPerfilController)
router.put('/me/senha', autenticar, trocarMinhaSenha);
module.exports = router