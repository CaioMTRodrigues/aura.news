import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || "";
    const email = (searchParams.get("email") || "").toLowerCase();

    if (!token || !email) {
      return NextResponse.redirect(new URL("/subscribe?error=invalid", req.url));
    }

    // Busca token
    const vt = await prisma.verificationToken.findUnique({
      where: { token }, // token é único
    });

    if (!vt || vt.identifier.toLowerCase() !== email) {
      return NextResponse.redirect(new URL("/subscribe?error=invalid", req.url));
    }

    if (vt.expires < new Date()) {
      // Expirou
      // Apaga o token antigo por higiene
      await prisma.verificationToken.delete({ where: { token } }).catch(() => {});
      return NextResponse.redirect(new URL("/subscribe?error=expired", req.url));
    }

    // Ativa o subscriber
    await prisma.subscriber.upsert({
      where: { email },
      update: { status: "active" },
      create: { email, status: "active" },
    });

    // Apaga o token
    await prisma.verificationToken.delete({ where: { token } }).catch(() => {});

    // Redireciona para página de sucesso
    return NextResponse.redirect(new URL("/subscribe/success", req.url));
  } catch (err) {
    console.error("[/api/confirm] error:", err);
    return NextResponse.redirect(new URL("/subscribe?error=server", req.url));
  }
}
