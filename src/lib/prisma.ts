import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if DATABASE_URL is set and not empty
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '');

if (!hasDatabaseUrl) {
  console.warn('⚠️  DATABASE_URL is not set in environment variables!');
  console.warn(
    'Database features will be disabled. Please add DATABASE_URL to your .env.local file to enable database functionality.'
  );
}

// Only create PrismaClient if DATABASE_URL is set
// This prevents Prisma from trying to initialize without a valid connection string
export const prisma = hasDatabaseUrl
  ? (globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    }))
  : (null as unknown as PrismaClient); // Type cast to satisfy TypeScript, but routes should check DATABASE_URL before use

if (process.env.NODE_ENV !== 'production' && hasDatabaseUrl) {
  globalForPrisma.prisma = prisma;
}
