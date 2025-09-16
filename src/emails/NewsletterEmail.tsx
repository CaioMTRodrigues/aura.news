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
  Row,
  Column,
} from "@react-email/components";

type Article = {
  title: string;
  summary: string;
  url: string;
  tag?: string;         // ex: IA, Startups...
  source?: string;      // ex: TechCrunch
  imageUrl?: string;    // opcional (thumb)
};

type Props = {
  brand?: {
    name?: string;
    color?: string;       // cor principal (botão/realces)
    logoUrl?: string;     // logo 800x800 com fundo transparente
    siteUrl?: string;     // https://aura.news (futuro)
  };
  issue?: {
    number?: string | number;   // ex: #12
    title?: string;             // título da edição
    preheader?: string;         // texto de “preview” no e-mail
    date?: string;              // ex: 16 set 2025
  };
  hero?: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
  articles: Article[];          // lista de matérias/blocos
  cta?: {
    label: string;
    url: string;
  };
  footer?: {
    address?: string;
    unsubscribeUrl?: string;
    contactEmail?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
  };
};

export default function NewsletterEmail({
  brand = {
    name: "Aura.news",
    color: "#D427DE",
    logoUrl: undefined,
    siteUrl: "https://auracommunity.com.br",
  },
  issue = {
    number: "",
    title: "Seu radar semanal de tecnologia",
    preheader: "IA, Startups, Dev Hacks, Gadgets, Mercado Tech e Futuro do Trabalho.",
    date: "",
  },
  hero,
  articles,
  cta,
  footer = {
    address: "Auracommunity • Brasil",
    unsubscribeUrl: "#",
    contactEmail: "hello@auracommunity.com.br",
    twitterUrl: "",
    linkedinUrl: "",
  },
}: Props) {
  const preheaderText =
    issue?.preheader ||
    "IA, Startups, Dev Hacks, Gadgets, Mercado Tech e Futuro do Trabalho.";

  return (
    <Html>
      <Head />
      <Preview>{preheaderText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Row>
              <Column style={{ textAlign: "left" }}>
                {brand.logoUrl ? (
                  <Img
                    src={brand.logoUrl}
                    width="40"
                    height="40"
                    alt={brand.name}
                    style={{ borderRadius: 12 }}
                  />
                ) : (
                  <Heading style={{ ...styles.brand, color: brand.color }}>
                    {brand.name}
                  </Heading>
                )}
                <Text style={styles.meta}>
                  {issue.title}
                  {issue.number ? ` ${issue.number}` : ""} {issue.date ? `• ${issue.date}` : ""}
                </Text>
              </Column>
              {brand.siteUrl && (
                <Column style={{ textAlign: "right", verticalAlign: "middle" }}>
                  <Link href={brand.siteUrl} style={styles.siteLink}>
                    Ver no navegador
                  </Link>
                </Column>
              )}
            </Row>
          </Section>

          {/* Hero (opcional) */}
          {hero && (hero.title || hero.imageUrl) && (
            <Section style={styles.hero}>
              {hero.imageUrl && (
                <Img
                  src={hero.imageUrl}
                  alt={hero.title || "Hero"}
                  width="100%"
                  style={{ borderRadius: 12, marginBottom: 12 }}
                />
              )}
              {hero.title && (
                <Heading style={styles.h1}>
                  {hero.title}
                </Heading>
              )}
              {hero.subtitle && <Text style={styles.text}>{hero.subtitle}</Text>}
              {hero.ctaUrl && hero.ctaLabel && (
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <a href={hero.ctaUrl} style={{ ...styles.button, background: brand.color, color: "#000" }}>
                    {hero.ctaLabel}
                  </a>
                </div>
              )}
            </Section>
          )}

          <Hr style={styles.hr} />

          {/* Articles */}
          <Section style={{ marginTop: 10 }}>
            {articles.map((a, idx) => (
              <Row key={idx} style={styles.articleRow}>
                {a.imageUrl && (
                  <Column style={{ width: "84px", paddingRight: "12px" }}>
                    <Img
                      src={a.imageUrl}
                      alt={a.title}
                      width="84"
                      height="84"
                      style={{ borderRadius: 10, objectFit: "cover" }}
                    />
                  </Column>
                )}
                <Column>
                  <Heading as="h2" style={styles.h2}>
                    <Link href={a.url} style={{ ...styles.linkTitle, color: brand.color }}>
                      {a.title}
                    </Link>
                  </Heading>
                  <Text style={styles.summary}>{a.summary}</Text>
                  <Text style={styles.kicker}>
                    {a.tag ? `#${a.tag}` : ""} {a.source ? (a.tag ? " • " : "") + a.source : ""}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* CTA (opcional) */}
          {cta && (
            <>
              <Hr style={styles.hr} />
              <Section style={{ textAlign: "center", marginTop: 10 }}>
                <a href={cta.url} style={{ ...styles.button, background: brand.color, color: "#000" }}>
                  {cta.label}
                </a>
              </Section>
            </>
          )}

          {/* Footer */}
          <Hr style={styles.hr} />
          <Section>
            <Text style={styles.footerText}>
              Recebeu este e-mail porque se inscreveu na {brand.name}.
              <br />
              {footer.address}
            </Text>
            <Text style={styles.footerLinks}>
              {footer.unsubscribeUrl && (
                <>
                  <Link href={footer.unsubscribeUrl} style={styles.footerLink}>
                    Descadastrar
                  </Link>
                  {" • "}
                </>
              )}
              {footer.contactEmail && (
                <>
                  <Link href={`mailto:${footer.contactEmail}`} style={styles.footerLink}>
                    Suporte
                  </Link>
                  {" • "}
                </>
              )}
              {footer.twitterUrl && (
                <>
                  <Link href={footer.twitterUrl} style={styles.footerLink}>
                    Twitter
                  </Link>
                  {" • "}
                </>
              )}
              {footer.linkedinUrl && (
                <Link href={footer.linkedinUrl} style={styles.footerLink}>
                  LinkedIn
                </Link>
              )}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: { background: "#0B0B0B", color: "#FFFFFF", fontFamily: "Inter, Arial, sans-serif" },
  container: {
    maxWidth: 640,
    margin: "24px auto",
    background: "#111",
    padding: "24px 20px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  header: { marginBottom: 6 },
  brand: { fontSize: 18, fontWeight: 800, margin: 0 },
  meta: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 6 },
  siteLink: { fontSize: 12, color: "#9ad6ff", textDecoration: "underline" },
  hero: { marginTop: 8, marginBottom: 8 },
  h1: { fontSize: 22, lineHeight: "28px", margin: "6px 0 4px", fontWeight: 800 },
  h2: { fontSize: 16, lineHeight: "22px", margin: "2px 0 4px", fontWeight: 700 },
  text: { fontSize: 14, lineHeight: "22px", color: "rgba(255,255,255,0.9)" },
  summary: { fontSize: 13, lineHeight: "20px", color: "rgba(255,255,255,0.8)", marginTop: 2 },
  kicker: { fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 6 },
  linkTitle: { textDecoration: "none" },
  articleRow: { marginBottom: 14 },
  button: {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: 10,
    fontWeight: 700,
    textDecoration: "none",
  },
  hr: { borderColor: "rgba(255,255,255,0.08)", margin: "14px 0" },
  footerText: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  footerLinks: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 8 },
  footerLink: { color: "#9ad6ff", textDecoration: "underline" },
};
