import Link from "next/link";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function IssuesListPage() {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { curatedItems: true, sendEvents: true } },
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edições</h1>
        <Link
          href="/admin/issues/new"
          className="rounded bg-[#D427DEFF] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          Nova edição
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-white/70">
            <tr>
              <th className="py-2 pr-3">Título</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Criada</th>
              <th className="py-2 pr-3">Agendada</th>
              <th className="py-2 pr-3">Enviada</th>
              <th className="py-2 pr-3">Itens</th>
              <th className="py-2 pr-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {issues.map((i) => (
              <tr key={i.id}>
                <td className="py-2 pr-3">
                  <div className="font-medium">{i.title}</div>
                  <div className="text-xs text-white/50">{i.slug}</div>
                </td>
                <td className="py-2 pr-3">
                  <span className="rounded bg-white/10 px-2 py-1 text-xs">{i.status}</span>
                </td>
                <td className="py-2 pr-3">
                  {format(i.createdAt, "dd MMM yyyy", { locale: ptBR })}
                </td>
                <td className="py-2 pr-3">
                  {i.scheduledFor
                    ? format(i.scheduledFor, "dd MMM yyyy HH:mm", { locale: ptBR })
                    : "—"}
                </td>
                <td className="py-2 pr-3">
                  {i.sentAt ? format(i.sentAt, "dd MMM yyyy HH:mm", { locale: ptBR }) : "—"}
                </td>
                <td className="py-2 pr-3">{i._count.curatedItems}</td>
                <td className="py-2 pr-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Editar por ID (seguro para todas as ações) */}
                    <Link
                      href={`/admin/issues/${i.id}`}
                      className="rounded border border-white/15 px-3 py-1 hover:bg-white/5"
                    >
                      Editar (id)
                    </Link>
                    {/* Editar por SLUG (útil se você prefere usar slugs na URL) */}
                    <Link
                      href={`/admin/issues/${i.slug}`}
                      className="rounded border border-white/15 px-3 py-1 hover:bg-white/5 text-white/80"
                    >
                      Editar (slug)
                    </Link>

                    {/* Enviar agora: enfileira job no BullMQ */}
                    <form
                      action={async () => {
                        "use server";
                        // Sempre enfileira pelo ID (o endpoint já aceita id/slug, mas id é mais direto)
                        const res = await fetch(
                          `${process.env.NEXTAUTH_URL}/api/issues/${i.id}/send`,
                          { method: "POST" }
                        );
                        if (!res.ok) {
                          console.error(
                            "Falha ao enfileirar envio",
                            await res.text()
                          );
                        }
                      }}
                    >
                      <button
                        className="rounded border border-white/15 px-3 py-1 hover:bg-white/5"
                        title="Enfileirar envio agora"
                      >
                        Enviar agora
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {issues.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-white/60">
                  Nenhuma edição ainda. Crie a primeira!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
