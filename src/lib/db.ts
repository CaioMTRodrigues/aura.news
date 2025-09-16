// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

// Tipar o objeto global para evitar erro TS7017
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"], // você pode adicionar "query" para debug
  });

// Em dev, mantém a instância no global para evitar muitas conexões
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
