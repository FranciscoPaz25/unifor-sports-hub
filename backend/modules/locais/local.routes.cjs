const express = require('express');
const prisma = require('../../lib/prisma.cjs');
const autenticar = require('../../middlewares/autenticar.cjs');

const router = express.Router();

// Lista de locais para o campo "Local" da tela 20 (Criar esporte)
router.get('/', autenticar, async (req, res) => {
    const locais = await prisma.local.findMany({
        orderBy: { Nome: 'asc' },
        select: { idLocal: true, Nome: true, Capacidade: true },
    });
    return res.status(200).json({
        locais: locais.map((l) => ({ id: l.idLocal, nome: l.Nome, capacidade: l.Capacidade })),
    });
});

module.exports = router;
