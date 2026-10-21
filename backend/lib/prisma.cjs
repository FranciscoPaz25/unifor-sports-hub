require('dotenv/config');

const { PrismaClient } = require('../generated/prisma/client.ts');
const { PrismaMariaDb} = require('@prisma/adapter-mariadb')


const databaseUrl = process.env.DATABASE_URL;

if(!databaseUrl) {
    throw new Error('DATABASE_URL não está definido no arquivo .env');
}

const adapter = new PrismaMariaDb(databaseUrl);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;