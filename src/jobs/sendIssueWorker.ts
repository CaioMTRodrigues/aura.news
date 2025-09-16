// src/jobs/sendIssueWorker.ts
import "dotenv/config";
import { Worker, Job } from "bullmq";
import { redis } from "@/lib/redis";
import { QUEUE_SEND_ISSUE } from "@/lib/queue";
import { prisma } from "@/lib/db";
import { sendNewsletter } from "@/lib/sendNewsletter";

console.log("[worker] Booting sendIssueWorker…");
process.on("unhandledRejection", (err) => {
  console.error("[worker] UnhandledRejection", err);
});
process.on("uncaughtException", (err) => {
  console.error("[worker] UncaughtException", err);
});


const CONCURRENCY = 3;   // workers paralelos
const BATCH_SIZE = 50;   // e-mails por lote
const SUBJECT_PREFIX = "Aura.news — ";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

type SendIssueJob = { issueId: string };

async function processJob(job: Job<SendIssueJob>) {
  const { issueId } = job.data;
  console.log(`[worker] Iniciando envio da issue ${issueId}`);

  // 1) Issue + itens
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { curatedItems: { orderBy: { impactScore: "desc" } } },
  });
  if (!issue) throw new Error("Issue não encontrada");

  // 2) Props do template
  const articles = issue.curatedItems.map((ci) => ({
    title: ci.title,
    summary: ci.summary,
    url: ci.url,
    tag: ci.category,
    source: ci.source,
  }));

  // 3) Subscribers ativos
  const subscribers = await prisma.subscriber.findMany({
    where: { status: "active" },
    select: { email: true },
  });
  const emails = subscribers.map((s) => s.email);

  if (emails.length === 0) {
    console.warn("[worker] Nenhum subscriber ativo — envio abortado");
    return;
  }

  // 4) Disparo por lotes
  const batches = chunk(emails, BATCH_SIZE);
  let sentCount = 0;

  for (const batch of batches) {
    const subject = `${SUBJECT_PREFIX}${issue.subject}`;

    await sendNewsletter({
      to: batch,
      subject,
      brand: {
        name: "Aura.news",
        color: "#D427DE",
        siteUrl: process.env.NEXTAUTH_URL,
      },
      issue: {
        number: "",
        title: issue.title,
        preheader: issue.preheader ?? undefined,
        date: new Date().toLocaleDateString("pt-BR"),
      },
      articles,
      cta: {
        label: "Ver no site",
        url: `${process.env.NEXTAUTH_URL}/archive`,
      },
      footer: {
        address: "Auracommunity • Brasil",
        unsubscribeUrl: `${process.env.NEXTAUTH_URL}/unsubscribe`, // implementar depois
        contactEmail: "hello@auracommunity.com.br",
      },
    });

    sentCount += batch.length;
    console.log(`[worker] Lote enviado: +${batch.length} (total: ${sentCount}/${emails.length})`);
  }

  // 5) Marca issue como enviada
  await prisma.issue.update({
    where: { id: issueId },
    data: { status: "sent", sentAt: new Date() },
  });

  console.log(`[worker] Issue ${issueId} concluída. Enviados: ${sentCount}`);
}

// Worker com conexão ioredis compartilhada
new Worker<SendIssueJob>(
  QUEUE_SEND_ISSUE,
  async (job) => processJob(job),
  { connection: redis, concurrency: CONCURRENCY }
)
  .on("failed", (job, err) => {
    console.error("[worker] Job failed:", job?.id, err);
  })
  .on("completed", (job) => {
    console.log("[worker] Job completed:", job.id);
  })

  .on("ready", () => {
    console.log("[worker] Ready (connected to Redis).");
  });

// Encerramento gracioso (Ctrl+C)
process.on("SIGINT", async () => {
  try {
    await redis.quit();
  } finally {
    process.exit(0);
  }
});
