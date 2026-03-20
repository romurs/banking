import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const connectionString = process.env.DATABASE_URL!;

// Адаптер сам создаст пул из строки подключения
const adapter = new PrismaMariaDb(connectionString);

export const prisma = new PrismaClient({ adapter });