// src/app/dev/email/newsletter/route.tsx
import * as React from "react";
import { NextResponse } from "next/server";
// Opção A: usar a versão assíncrona explícita
import { renderAsync } from "@react-email/render";
// Opção B (alternativa): import { render } from "@react-email/render"; e usar await render(...)

import NewsletterEmail from "@/emails/NewsletterEmail";

export async function GET() {
  const html = await renderAsync(
    <NewsletterEmail
      issue={{ number: "#01", title: "Aura.news", date: "Ter, 16 Set 2025" }}
      hero={{
        title: "As 5 de hoje: IA, Code e Mercado",
        subtitle: "O que importa no seu inbox, sem ruído.",
        imageUrl: "https://placehold.co/1200x600/png",
        ctaLabel: "Ler no site",
        ctaUrl: "https://auracommunity.com.br",
      }}
      articles={[
        {
          title: "GPT-5? O que sabemos até agora",
          summary: "Rumores, roadmap e impacto para devs e startups.",
          url: "https://example.com/1",
          tag: "IA",
          source: "Exemplo",
          imageUrl: "https://placehold.co/168",
        },
        {
          title: "Dev Hacks: 7 atalhos de produtividade no VSCode",
          summary: "Extensões e snippets para acelerar seu dia a dia.",
          url: "https://example.com/2",
          tag: "DevHacks",
          source: "Exemplo",
        },
        {
          title: "Startups: rodadas da semana",
          summary: "Captações relevantes e teses que chamaram atenção.",
          url: "https://example.com/3",
          tag: "Startups",
          source: "Exemplo",
        },
      ]}
      cta={{ label: "Ver todas as edições", url: "https://auracommunity.com.br/archive" }}
      footer={{
        address: "Auracommunity • Brasil",
        unsubscribeUrl: "https://auracommunity.com.br/unsubscribe",
        contactEmail: "hello@auracommunity.com.br",
        twitterUrl: "https://twitter.com/",
        linkedinUrl: "https://linkedin.com/",
      }}
      brand={{ name: "Aura.news", color: "#D427DE", logoUrl: undefined, siteUrl: "https://auracommunity.com.br" }}
    />
  );

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
