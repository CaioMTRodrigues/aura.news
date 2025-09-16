import { NextResponse } from "next/server";
import { getSendIssueQueue } from "@/lib/queue";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user?.email || role !== "admin") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const raw = params.id;

  const issue =
    (await prisma.issue.findUnique({ where: { id: raw }, select: { id: true } })) ??
    (await prisma.issue.findUnique({ where: { slug: raw }, select: { id: true } }));

  if (!issue) {
    return NextResponse.json({ ok: false, error: "Issue não encontrada" }, { status: 404 });
  }

  const queue = getSendIssueQueue();
  const job = await queue.add("send-issue", { issueId: issue.id });

  return NextResponse.json({ ok: true, jobId: job.id });
}
