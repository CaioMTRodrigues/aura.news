import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Hr,
  Img,
} from "@react-email/components";

type Brand = {
  name: string;
  color: string;
  logoUrl?: string;
};

type Props = {
  url: string;
  brand?: Brand;            // opcional na props…
  supportEmail?: string;    // …mas vamos definir defaults sólidos
};

export default function MagicLinkEmail({
  url,
  // Defaults garantem que brand NUNCA será undefined dentro do componente
  brand = {
    name: "Aura.news",
    color: "#D427DE",
    logoUrl: undefined,
  },
  supportEmail = "hello@auracommunity.com.br",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Seu link mágico para entrar na {brand.name}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {brand.logoUrl ? (
            <Section style={{ textAlign: "center", marginBottom: 10 }}>
              <Img
                src={brand.logoUrl}
                width="56"
                height="56"
                alt={brand.name}
                style={{ borderRadius: 12 }}
              />
            </Section>
          ) : (
            // Heading espera string — brand.name é sempre string (default acima)
            <Heading style={{ ...styles.h1, color: brand.color }}>
              {brand.name}
            </Heading>
          )}

          <Section>
            <Text style={styles.muted}>Olá! 👋</Text>
            <Text style={styles.text}>
              Clique no botão abaixo para entrar. Este link expira em alguns
              minutos por motivos de segurança.
            </Text>

            <Section style={{ textAlign: "center", margin: "22px 0" }}>
              <a
                href={url}
                style={{ ...styles.button, background: brand.color, color: "#000" }}
              >
                Entrar agora
              </a>
            </Section>

            <Text style={styles.text}>
              Se o botão não funcionar, copie e cole esta URL no navegador:
            </Text>
            <Link href={url} style={styles.link}>
              {url}
            </Link>

            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              Se você não solicitou este acesso, pode ignorar este e-mail.
              <br />
              Dúvidas? Fale com a gente:{" "}
              <a href={`mailto:${supportEmail}`} style={styles.link}>
                {supportEmail}
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    background: "#0B0B0B",
    color: "#FFFFFF",
    fontFamily: "Inter, Arial, sans-serif",
  },
  container: {
    maxWidth: 560,
    margin: "24px auto",
    background: "#111",
    padding: "28px 24px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  h1: { fontSize: 22, fontWeight: 800, margin: "0 0 6px" },
  text: { fontSize: 14, lineHeight: "22px", color: "rgba(255,255,255,0.92)" },
  muted: { fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 4 },
  button: {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: 10,
    fontWeight: 700,
    textDecoration: "none",
  },
  link: { color: "#9ad6ff", wordBreak: "break-all", fontSize: 12 },
  hr: { borderColor: "rgba(255,255,255,0.08)", margin: "18px 0" },
  footer: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
};
