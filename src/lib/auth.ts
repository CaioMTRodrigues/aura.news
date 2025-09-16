// src/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import type { JWT } from "next-auth/jwt";
import type { Session, User, NextAuthOptions } from "next-auth";
import MagicLinkEmail from "@/emails/MagicLinkEmail";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,                 // ex: "Aura.news <hello@auracommunity.com.br>"
          to: identifier,                                // e-mail do usuário
          subject: "Seu link mágico de acesso — Aura.news",
          react: MagicLinkEmail({
            url,
            brand: {
              name: "Aura.news",
              color: "#D427DE",
              // logoUrl: "https://seu-cdn/logo-800x800.png",
            },
            supportEmail: "hello@auracommunity.com.br",
          }),
        });
      },
    }),
  ],

  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },

  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: User | null;
    }) {
      if (user?.email) {
        const u = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true },
        });
        (token as JWT & { role?: string }).role = u?.role ?? "admin";
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & { role?: string };
    }) {
      if (session.user) {
        (session.user as any).role = token.role ?? "admin";
      }
      return session;
    },
  },
};
