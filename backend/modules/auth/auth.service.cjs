const prisma = require('../../lib/prisma.cjs');
const argon2 = require('argon2');

async function buscarUsuarioPorIdentificador(identificador) {
    const identifica = identificador.trim();

    if(identifica.includes('@')) {
        return await prisma.usuario.findUnique({
            where: { Email: identifica },
        });
    } else {
        return await prisma.usuario.findUnique({
            where: { Matricula: identifica },
        });
    }
}

async function autenticarUsuario(identificador, senha) {
    const usuario = await buscarUsuarioPorIdentificador(identificador);

    if (!usuario) {
        return null; // Usuário não encontrado
    }

    const senhaValida = await argon2.verify(usuario.Senha, senha);
    if (!senhaValida) {
        return null; // Senha inválida
    }
    
    const { idUsuario, Nome, TipoUsuario } = usuario;
    return { idUsuario, Nome, TipoUsuario }; // Retorna o usuário autenticado
}

module.exports = {
    buscarUsuarioPorIdentificador,
    autenticarUsuario
};