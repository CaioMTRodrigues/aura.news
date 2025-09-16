// src/emails/ConfirmSubscriptionEmail.tsx
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
} from "@react-email/components";

type Brand = {
  name: string;
  color: string;
};

type Props = {
  confirmUrl: string;
  // Permite passar só parte do Brand; completamos com defaults
  brand?: Partial<Brand>;
  supportEmail?: string;
};

export default function ConfirmSubscriptionEmail({
  confirmUrl,
  brand,
  supportEmail = "hello@auracommunity.com.br",
}: Props) {
  // Garante que sempre teremos strings (evita string | undefined)
  const b: Brand = {
    name: "Aura.news",
    color: "#D427DE",
    ...(brand ?? {}),
  };

  return (
    <Html>
      <Head />
      <Preview>Confirme sua inscrição na {b.name}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={{ ...styles.h1, color: b.color }}>{b.name}</Heading>

          <Section>
            <Text style={styles.text}>
              Obrigado por se inscrever! Clique no botão abaixo para confirmar sua inscrição.
            </Text>

            <div style={{ textAlign: "center", margin: "18px 0" }}>
              <a
                href={confirmUrl}
                style={{ ...styles.button, background: b.color, color: "#000" }}
              >
                Confirmar inscrição
              </a>
            </div>

            <Text style={styles.text}>
              Se o botão não funcionar, copie e cole este link no navegador:
            </Text>
            <Link href={confirmUrl} style={styles.link}>
              {confirmUrl}
            </Link>

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              Se você não solicitou esta inscrição, pode ignorar este e-mail.
              <br />
              Suporte:{" "}
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
    padding: "24px 20px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  h1: { fontSize: 22, fontWeight: 800, margin: "0 0 6px" },
  text: { fontSize: 14, lineHeight: "22px", color: "rgba(255,255,255,0.92)" },
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
