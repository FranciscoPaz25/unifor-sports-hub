// Dados iniciais: locais esportivos e o usuário administrador.
// Rodar com `npm run seed` (dentro de backend). Pode ser executado mais de uma
// vez: o que já existe é mantido e só o que falta é criado.
const argon2 = require('argon2');
const prisma = require('../lib/prisma.cjs');

// Mesmos nomes usados nos mocks do frontend (mocks/esportes.js e eventos.js)
const LOCAIS = [
    { Nome: 'Ginásio Poliesportivo', Capacidade: 300 },
    { Nome: 'Quadra 1 — Campus Central', Capacidade: 40 },
    { Nome: 'Quadra 2 — Campus Central', Capacidade: 40 },
    { Nome: 'Quadra de Areia — Campus Central', Capacidade: 30 },
    { Nome: 'Piscina Olímpica', Capacidade: 60 },
    { Nome: 'Pista de Atletismo', Capacidade: 200 },
];

function lerAdminDoEnv() {
    const admin = {
        Nome: process.env.SEED_ADMIN_NOME || 'Administrador Unifor Sports',
        Email: process.env.SEED_ADMIN_EMAIL || 'admin@unifor.br',
        Matricula: process.env.SEED_ADMIN_MATRICULA || '0010001',
        Senha: process.env.SEED_ADMIN_SENHA,
    };

    // Mesma política da troca de senha: 15 a 128 caracteres, sem trim
    if (typeof admin.Senha !== 'string' || admin.Senha.length < 15 || admin.Senha.length > 128) {
        throw new Error('Defina SEED_ADMIN_SENHA no backend/.env com 15 a 128 caracteres.');
    }
    if (!/^[A-Za-z0-9._%+-]+@(unifor\.br|edu\.unifor\.br)$/i.test(admin.Email)) {
        throw new Error('SEED_ADMIN_EMAIL deve ser @unifor.br ou @edu.unifor.br.');
    }
    if (!/^[0-9]{2}[1-2][0-9]{4}$/.test(admin.Matricula)) {
        throw new Error('SEED_ADMIN_MATRICULA deve ter 7 dígitos no formato ^[0-9]{2}[1-2][0-9]{4}$.');
    }
    return admin;
}

async function criarLocais() {
    for (const local of LOCAIS) {
        const existente = await prisma.local.findFirst({ where: { Nome: local.Nome } });
        if (existente) {
            console.log(`Local já existe: ${local.Nome}`);
            continue;
        }
        await prisma.local.create({ data: local });
        console.log(`Local criado: ${local.Nome}`);
    }
}

async function criarAdmin() {
    const admin = lerAdminDoEnv();

    const existente = await prisma.usuario.findFirst({
        where: { OR: [{ Email: admin.Email }, { Matricula: admin.Matricula }] },
        select: { idUsuario: true, Email: true, TipoUsuario: true },
    });
    if (existente) {
        // Não sobrescreve senha nem dados de uma conta que já existe
        console.log(`Usuário já existe (${existente.Email}, ${existente.TipoUsuario}); nada alterado.`);
        return;
    }

    await prisma.usuario.create({
        data: {
            Nome: admin.Nome,
            Email: admin.Email,
            Matricula: admin.Matricula,
            Senha: await argon2.hash(admin.Senha),
            TipoUsuario: 'admin',
        },
    });
    console.log(`Admin criado: ${admin.Email} (matrícula ${admin.Matricula})`);
}

async function main() {
    await criarLocais();
    await criarAdmin();
}

main()
    .catch((err) => {
        console.error('Falha no seed:', err.message);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
