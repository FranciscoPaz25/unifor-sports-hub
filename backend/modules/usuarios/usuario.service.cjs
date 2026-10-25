const prisma = require('../../lib/prisma.cjs')
const argon2 = require('argon2');

async function buscarUsuarioPublicoPorId(idUsuario) {
    return prisma.usuario.findUnique({
        where: { idUsuario },
        select: {
            idUsuario: true,
            Nome: true,
            Email: true,
            Matricula: true,
            TipoUsuario: true
        }
    })

}

async function atualizarMeuPerfil(idUsuario, nome, email) {
    return prisma.usuario.update({
        where: { idUsuario },
        data: {
            Nome: nome.trim(),
            Email: email.trim(),
        },
        select: {
            idUsuario: true,
            Nome: true,
            Email: true,
            Matricula: true,
            TipoUsuario: true
        }

    })
}

async function trocarSenhaUsuario(idUsuario, senhaAtual, novaSenha) {
    const usuario = await prisma.usuario.findUnique({
        where: { idUsuario },
        select: { Senha: true },
    })
    if (!usuario) {
        return { status: 'usuario-nao-encontrado' };
    }
    const senhaCorreta = await argon2.verify(
        usuario.Senha,
        senhaAtual
    );
    if(!senhaCorreta){
        return { status: 'senha-atual-incorreta' };
    }
    const novoHash = await argon2.hash(novaSenha);
    await prisma.usuario.update({
        where: {idUsuario},
        data: {Senha: novoHash},
        select: { idUsuario: true}
    })
    return { status: 'senha-alterada' };
}

module.exports = {
    buscarUsuarioPublicoPorId,
    atualizarMeuPerfil,
    trocarSenhaUsuario
}