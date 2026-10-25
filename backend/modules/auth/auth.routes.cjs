const express = require('express');
const {login, logout, cadastro} = require('./auth.controller.cjs');
const autenticar = require('../../middlewares/autenticar.cjs');

const router = express.Router();
router.post('/cadastro', cadastro);
router.post('/login', login);
router.get('/sessao', autenticar, (req, res) => {
    res.json({ usuario: req.auth});
})
router.post('/logout', logout);
module.exports = router;
