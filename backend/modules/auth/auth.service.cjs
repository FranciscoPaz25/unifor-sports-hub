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

// Cria uma conta de aluno. O tipo é sempre 'aluno': admin não se cadastra pela interface.
// Retorna { status: 'email-em-uso' | 'matricula-em-uso' } se já existir conta com esses dados.
async function cadastrarAluno(nome, email, matricula, senha) {
    const emailLimpo = email.trim();
    const matriculaLimpa = matricula.trim();

    const existente = await prisma.usuario.findFirst({
        where: { OR: [{ Email: emailLimpo }, { Matricula: matriculaLimpa }] },
        select: { Email: true },
    });
    if (existente) {
        const mesmoEmail = existente.Email.toLowerCase() === emailLimpo.toLowerCase();
        return { status: mesmoEmail ? 'email-em-uso' : 'matricula-em-uso' };
    }

    const usuario = await prisma.usuario.create({
        data: {
            Nome: nome.trim(),
            Email: emailLimpo,
            Matricula: matriculaLimpa,
            Senha: await argon2.hash(senha),
            TipoUsuario: 'aluno',
        },
        select: {
            idUsuario: true,
            Nome: true,
            Email: true,
            Matricula: true,
            TipoUsuario: true,
        },
    });
    return { status: 'criado', usuario };
}

module.exports = {
    buscarUsuarioPorIdentificador,
    autenticarUsuario,
    cadastrarAluno
};