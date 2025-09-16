"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { Tag, IssueStatus } from "@prisma/client";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user?.email || role !== "admin") {
    throw new Error("Unauthorized");
  }
}

/* ========== ISSUES ========== */
export async function createIssueAction(formData: FormData) {
  await ensureAdmin();

  const title = String(formData.get("title") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const preheader = String(formData.get("preheader") || "").trim();
  const scheduledForRaw = String(formData.get("scheduledFor") || "").trim();

  if (!title || !subject) throw new Error("Título e Assunto são obrigatórios");

  const slugBase = slugify(title);
  // Garante unicidade simples
  const slugCandidate = slugBase || "edicao";
  let slug = slugCandidate;
  let i = 1;
  while (await prisma.issue.findUnique({ where: { slug } })) {
    slug = `${slugCandidate}-${i++}`;
  }

  const scheduledFor =
    scheduledForRaw ? new Date(scheduledForRaw) : null;

  const issue = await prisma.issue.create({
    data: {
      slug,
      title,
      subject,
      preheader,
      status: "draft",
      scheduledFor: scheduledFor ?? undefined,
    },
    select: { id: true, slug: true },
  });

  revalidatePath("/admin/issues");
  revalidatePath(`/admin/issues/${issue.id}`);
  return issue;
}

export async function updateIssueAction(issueId: string, formData: FormData) {
  await ensureAdmin();

  const title = String(formData.get("title") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const preheader = String(formData.get("preheader") || "").trim();
  const slugRaw = String(formData.get("slug") || "").trim();
  const scheduledForRaw = String(formData.get("scheduledFor") || "").trim();

  if (!title || !subject) throw new Error("Título e Assunto são obrigatórios");

  const scheduledFor =
    scheduledForRaw ? new Date(scheduledForRaw) : null;

  const slug = slugRaw ? slugify(slugRaw) : undefined;

  await prisma.issue.update({
    where: { id: issueId },
    data: {
      title,
      subject,
      preheader,
      ...(slug ? { slug } : {}),
      scheduledFor: scheduledFor ?? undefined,
    },
  });

  revalidatePath("/admin/issues");
  revalidatePath(`/admin/issues/${issueId}`);
}

export async function deleteIssueAction(issueId: string) {
  await ensureAdmin();
  await prisma.issue.delete({ where: { id: issueId } });
  revalidatePath("/admin/issues");
}

/* Mudança de status */
export async function setIssueStatusAction(issueId: string, newStatus: IssueStatus, when?: string) {
  await ensureAdmin();

  if (newStatus === "scheduled") {
    // ao agendar, exige scheduledFor
    const scheduledFor = when ? new Date(when) : null;
    if (!scheduledFor) throw new Error("Defina uma data/hora em 'scheduledFor' para agendar.");
    await prisma.issue.update({
      where: { id: issueId },
      data: { status: "scheduled", scheduledFor, sentAt: null },
    });
  } else if (newStatus === "sent") {
    await prisma.issue.update({
      where: { id: issueId },
      data: { status: "sent", sentAt: new Date() },
    });
  } else {
    // draft
    await prisma.issue.update({
      where: { id: issueId },
      data: { status: "draft", scheduledFor: null, sentAt: null },
    });
  }

  revalidatePath("/admin/issues");
  revalidatePath(`/admin/issues/${issueId}`);
}

/* ========== CURATED ITEMS ========== */
export async function addCuratedItemAction(issueId: string, formData: FormData) {
  await ensureAdmin();

  const source = String(formData.get("source") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const category = String(formData.get("category") || "").trim() as Tag;
  const impactScore = Number(formData.get("impactScore") || 0);

  if (!source || !url || !title || !summary) throw new Error("Preencha todos os campos do item.");
  if (!Object.values(Tag).includes(category)) throw new Error("Categoria inválida.");

  await prisma.curatedItem.create({
    data: {
      issueId,
      source,
      url,
      title,
      summary,
      category,
      impactScore: Number.isFinite(impactScore) ? impactScore : 0,
    },
  });

  revalidatePath(`/admin/issues/${issueId}`);
}

export async function updateCuratedItemAction(itemId: string, issueId: string, formData: FormData) {
  await ensureAdmin();

  const source = String(formData.get("source") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const category = String(formData.get("category") || "").trim() as Tag;
  const impactScore = Number(formData.get("impactScore") || 0);

  if (!source || !url || !title || !summary) throw new Error("Preencha todos os campos do item.");
  if (!Object.values(Tag).includes(category)) throw new Error("Categoria inválida.");

  await prisma.curatedItem.update({
    where: { id: itemId },
    data: {
      source,
      url,
      title,
      summary,
      category,
      impactScore: Number.isFinite(impactScore) ? impactScore : 0,
    },
  });

  revalidatePath(`/admin/issues/${issueId}`);
}

export async function deleteCuratedItemAction(itemId: string, issueId: string) {
  await ensureAdmin();
  await prisma.curatedItem.delete({ where: { id: itemId } });
  revalidatePath(`/admin/issues/${issueId}`);
}
