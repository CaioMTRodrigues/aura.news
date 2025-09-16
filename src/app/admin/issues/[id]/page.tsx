import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  updateIssueAction,
  deleteIssueAction,
  addCuratedItemAction,
  updateCuratedItemAction,
  deleteCuratedItemAction,
  setIssueStatusAction,
} from "../actions";
import { Tag } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSendIssueQueue } from "@/lib/queue";

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: raw } = await params;

  // Tenta por id; se não achar, tenta por slug
  let issue =
    (await prisma.issue.findUnique({
      where: { id: raw },
      include: { curatedItems: { orderBy: { createdAt: "desc" } } },
    })) ??
    (await prisma.issue.findUnique({
      where: { slug: raw },
      include: { curatedItems: { orderBy: { createdAt: "desc" } } },
    }));

  if (!issue) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-white/70">Edição não encontrada.</p>
        <Link href="/admin/issues" className="underline">Voltar</Link>
      </main>
    );
  }

  const tagOptions: Tag[] = ["IA", "Startups", "DevHacks", "Gadgets", "MercadoTech", "FuturoDoTrabalho"];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Editar edição</h1>

        <div className="flex items-center gap-2">
          {/* Enviar agora (enfileira direto no BullMQ) */}
          <form
            action={async () => {
              "use server";
              const queue = getSendIssueQueue();
              await queue.add("send-issue", { issueId: issue!.id });
            }}
          >
            <button className="rounded bg-[#D427DEFF] px-3 py-2 text-sm font-semibold text-black hover:opacity-90">
              Enviar agora
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await deleteIssueAction(issue!.id);
              redirect("/admin/issues");
            }}
          >
            <button className="rounded border border-red-500 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10">
              Excluir edição
            </button>
          </form>
        </div>
      </div>

      {/* STATUS */}
      <section className="mt-6 rounded border border-white/10 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <div className="text-sm text-white/60">Status atual</div>
            <div className="text-lg font-semibold">{issue.status}</div>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server";
              const when = String(formData.get("when") || "");
              await setIssueStatusAction(issue!.id, "scheduled", when);
            }}
            className="flex items-end gap-2"
          >
            <div>
              <label className="block text-sm text-white/70">Agendar para</label>
              <input
                type="datetime-local"
                name="when"
                defaultValue={
                  issue.scheduledFor
                    ? new Date(
                        issue.scheduledFor.getTime() -
                          issue.scheduledFor.getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                className="mt-1 rounded border border-white/15 bg-black px-3 py-2"
              />
            </div>
            <button className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
              Marcar como scheduled
            </button>
          </form>

          <form action={async () => { "use server"; await setIssueStatusAction(issue!.id, "draft"); }}>
            <button className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
              Voltar para draft
            </button>
          </form>

          <form action={async () => { "use server"; await setIssueStatusAction(issue!.id, "sent"); }}>
            <button className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
              Marcar como sent
            </button>
          </form>
        </div>
      </section>

      {/* FORM ISSUE */}
      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <form
          action={async (formData: FormData) => {
            "use server";
            await updateIssueAction(issue!.id, formData);
          }}
          className="rounded border border-white/10 p-4"
        >
          <h2 className="mb-3 font-semibold">Metadados</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-white/70">Título</label>
              <input
                name="title"
                defaultValue={issue.title}
                className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70">Assunto (subject)</label>
              <input
                name="subject"
                defaultValue={issue.subject}
                className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70">Preheader</label>
              <input
                name="preheader"
                defaultValue={issue.preheader ?? ""}
                className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70">Slug</label>
              <input
                name="slug"
                defaultValue={issue.slug}
                className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70">Agendado para</label>
              <input
                type="datetime-local"
                name="scheduledFor"
                defaultValue={
                  issue.scheduledFor
                    ? new Date(
                        issue.scheduledFor.getTime() -
                          issue.scheduledFor.getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <button className="rounded bg-[#D427DEFF] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
              Salvar alterações
            </button>
          </div>
        </form>

        {/* NOVO ITEM */}
        <form
          action={async (formData: FormData) => {
            "use server";
            await addCuratedItemAction(issue!.id, formData);
          }}
          className="rounded border border-white/10 p-4"
        >
          <h2 className="mb-3 font-semibold">Adicionar item curado</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-white/70">Fonte</label>
              <input name="source" className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-white/70">URL</label>
              <input name="url" className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-white/70">Título</label>
              <input name="title" className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-white/70">Resumo</label>
              <textarea name="summary" rows={3} className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-white/70">Categoria</label>
                <select name="category" className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2">
                  {tagOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70">Impact Score</label>
                <input name="impactScore" type="number" defaultValue={0} className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
              Adicionar item
            </button>
          </div>
        </form>
      </section>

      {/* LISTA DE ITENS */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Itens curados</h2>
        <div className="space-y-4">
          {issue.curatedItems.map((ci) => (
            <div key={ci.id} className="rounded border border-white/10 p-4">
              <form
                action={async (formData: FormData) => {
                  "use server";
                  await updateCuratedItemAction(ci.id, issue!.id, formData);
                }}
                className="grid gap-3 md:grid-cols-2"
              >
                <div>
                  <label className="block text-sm text-white/70">Fonte</label>
                  <input name="source" defaultValue={ci.source} className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm text-white/70">URL</label>
                  <input name="url" defaultValue={ci.url} className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-white/70">Título</label>
                  <input name="title" defaultValue={ci.title} className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-white/70">Resumo</label>
                  <textarea name="summary" defaultValue={ci.summary} rows={3} className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm text-white/70">Categoria</label>
                  <select name="category" defaultValue={ci.category} className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2">
                    {tagOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/70">Impact Score</label>
                  <input name="impactScore" type="number" defaultValue={ci.impactScore} className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2" />
                </div>

                <div className="md:col-span-2 mt-2 flex items-center gap-3">
                  <button className="rounded bg-[#D427DEFF] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
                    Salvar item
                  </button>

                  {/* Form separado para deletar (evita nested forms) */}
                  <form action={async () => { "use server"; await deleteCuratedItemAction(ci.id, issue!.id); }}>
                    <button type="submit" className="rounded border border-red-500 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10">
                      Excluir
                    </button>
                  </form>
                </div>
              </form>
            </div>
          ))}
          {issue.curatedItems.length === 0 && (
            <p className="text-white/60">Nenhum item ainda. Adicione ao lado.</p>
          )}
        </div>
      </section>

      <div className="mt-8">
        <Link href="/admin/issues" className="text-sm text-white/70 underline">Voltar para lista</Link>
      </div>
    </main>
  );
}
