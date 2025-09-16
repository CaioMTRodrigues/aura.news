import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";
import ConfirmSubscriptionEmail from "@/emails/ConfirmSubscriptionEmail";
import crypto from "node:crypto";

const resend = new Resend(process.env.RESEND_API_KEY!);
const DOUBLE_OPT_IN = true; // deixe true (recomendado). Se quiser single opt-in, mude para false.

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let email = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = String(body.email || "");
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const body = await req.formData();
      email = String(body.get("email") || "");
    } else {
      return NextResponse.json({ ok: false, error: "Unsupported content-type" }, { status: 400 });
    }

    email = normalizeEmail(email);
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "E-mail inválido" }, { status: 400 });
    }

    // Upsert no Subscriber
    const existing = await prisma.subscriber.findUnique({ where: { email } });

    if (!DOUBLE_OPT_IN) {
      // Single opt-in: ativa direto
      await prisma.subscriber.upsert({
        where: { email },
        update: { status: "active" },
        create: { email, status: "active" },
      });
      return NextResponse.json({ ok: true, mode: "single" });
    }

    // Double opt-in: marca como unconfirmed e envia link
    await prisma.subscriber.upsert({
      where: { email },
      update: { status: "unconfirmed" },
      create: { email, status: "unconfirmed" },
    });

    // Cria VerificationToken (da própria tabela do NextAuth)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    // Use a PK "[identifier, token]" única
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const confirmUrl = `${baseUrl}/api/confirm?token=${token}&email=${encodeURIComponent(email)}`;

    // Envia o e-mail de confirmação
    await resend.emails.send({
      from: process.env.EMAIL_FROM!, // ex: "Aura.news <hello@auracommunity.com.br>"
      to: email,
      subject: "Confirme sua inscrição — Aura.news",
      react: ConfirmSubscriptionEmail({
        confirmUrl,
        brand: { name: "Aura.news", color: "#D427DE" },
        supportEmail: "hello@auracommunity.com.br",
      }),
    });

    return NextResponse.json({ ok: true, mode: "double" });
  } catch (err: any) {
    console.error("[/api/subscribe] error:", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
