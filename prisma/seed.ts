import { prisma } from "../src/lib/db";

async function main() {
  const issue = await prisma.issue.create({
    data: {
      slug: "edicao-exemplo",
      title: "Aura.news — Edição de Exemplo",
      subject: "As 5 de hoje",
      preheader: "IA, Startups e Dev Hacks",
    },
  });

  await prisma.curatedItem.createMany({
    data: [
      { issueId: issue.id, source: "Exemplo", url: "https://example.com/1", title: "Notícia 1", summary: "Resumo 1", category: "IA", impactScore: 7 },
      { issueId: issue.id, source: "Exemplo", url: "https://example.com/2", title: "Notícia 2", summary: "Resumo 2", category: "Startups", impactScore: 8 },
    ],
  });

  console.log("Seed ok", issue.slug);
}

main().finally(() => process.exit(0));
