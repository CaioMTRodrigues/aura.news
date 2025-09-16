// src/lib/redis.ts
import Redis from "ioredis";

// Singleton compartilhado
let instance: Redis | null = null;

export function getRedis(): Redis {
  if (!instance) {
    instance = new Redis(process.env.REDIS_URL!, {
      // Recomendado p/ BullMQ
      maxRetriesPerRequest: null,
    });
  }
  return instance;
}

// Caso prefira importar direto:
export const redis = getRedis();
