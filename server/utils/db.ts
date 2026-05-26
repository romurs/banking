import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const connectionString = process.env.DATABASE_URL!;
const mariaDbConnectionString = connectionString.startsWith("mysql://")
  ? `mariadb://${connectionString.slice("mysql://".length)}`
  : connectionString;

const adapter = new PrismaMariaDb(mariaDbConnectionString);

export const prisma = new PrismaClient({ adapter });
