// src/app/dev/email/magic/route.tsx
import * as React from "react";
import { NextResponse } from "next/server";
import { renderAsync } from "@react-email/render";
import MagicLinkEmail from "@/emails/MagicLinkEmail";

export async function GET() {
  const html = await renderAsync(
    <MagicLinkEmail
      url="https://example.com/auth/callback?token=fake"
      brand={{ name: "Aura.news", color: "#D427DE" }}
      supportEmail="hello@auracommunity.com.br"
    />
  );

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
