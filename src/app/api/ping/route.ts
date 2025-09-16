// src/app/api/ping/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // consulta simples: contar subscribers
  const count = await prisma.subscriber.count();
  return NextResponse.json({ ok: true, subscribers: count });
}
