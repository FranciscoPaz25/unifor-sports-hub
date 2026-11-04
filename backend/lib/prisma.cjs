require('dotenv/config');

const fs = require('fs');
const { PrismaClient } = require('../generated/prisma/client.ts');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL não está definido no arquivo .env');
}

// Banco local (Docker): conecta direto pela URL, sem criptografia.
// Banco de produção (Aiven): exige conexão criptografada (TLS). Com DATABASE_CA_PATH apontando para o
// certificado do Aiven (ca.pem), o backend confere se está falando com o banco verdadeiro.
function configuracaoDoBanco() {
    const caminhoCa = process.env.DATABASE_CA_PATH;
    if (!caminhoCa) return databaseUrl;

    const url = new URL(databaseUrl);
    return {
        host: url.hostname,
        port: Number(url.port) || 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.slice(1),
        ssl: { ca: fs.readFileSync(caminhoCa, 'utf8'), rejectUnauthorized: true },
        // O padrão (1 s) é pouco para abrir uma conexão criptografada com um banco em outro país
        connectTimeout: 10000,
        acquireTimeout: 15000,
    };
}

const adapter = new PrismaMariaDb(configuracaoDoBanco());
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
