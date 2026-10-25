const prisma = require('../lib/prisma.cjs');

// Libera a rota só para administradores. Usar sempre depois de `autenticar`.
// O perfil é lido do banco a cada requisição, nunca de dados enviados pelo cliente.
async function exigirAdmin(req, res, next) {
    const usuario = await prisma.usuario.findUnique({
        where: { idUsuario: req.auth.idUsuario },
        select: { TipoUsuario: true },
    });

    if (!usuario) {
        return res.status(401).json({
            mensagem: 'Usuário da sessão não encontrado.'
        });
    }

    if (usuario.TipoUsuario !== 'admin') {
        return res.status(403).json({
            mensagem: 'Acesso restrito ao administrador.'
        });
    }

    req.auth.tipoUsuario = usuario.TipoUsuario;
    return next();
}

module.exports = exigirAdmin;
