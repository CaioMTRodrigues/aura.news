// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Aura.news — Seu radar semanal de tecnologia",
  description: "IA, Startups, Dev Hacks, Gadgets, Mercado Tech e Futuro do Trabalho.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Aura.news",
    description: "Seu radar semanal de tecnologia",
    type: "website",
    url: "http://localhost:3000",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-black text-white">
        {/* SessionProvider (NextAuth) aplicado globalmente */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
