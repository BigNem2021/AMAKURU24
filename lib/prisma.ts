import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3} from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';

declare global {
  var prisma: PrismaClient | undefined;
}

function getPrismaClient() {
  if (typeof window !== 'undefined') {
    throw new Error('PrismaClient should not be instantiated on the client');
  }
  
  if (global.prisma) {
    return global.prisma;
  }

  const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './prisma/dev.db';
  const adapter = new PrismaBetterSqlite3({
    url: dbPath,
  });

  const client = new PrismaClient({
    adapter: adapter,
  } as any);

  if (process.env.NODE_ENV === 'development') {
    global.prisma = client;
  }

  return client;
}

export const prisma = getPrismaClient();
