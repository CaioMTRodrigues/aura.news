import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// validação simples de e-mail
function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !isEmail(email)) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }

    await prisma.subscriber.upsert({
      where: { email },
      update: { status: "active" },
      create: { email, status: "active" },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("subscribe error", e);
    return NextResponse.json({ error: "Erro ao inscrever" }, { status: 500 });
  }
}
