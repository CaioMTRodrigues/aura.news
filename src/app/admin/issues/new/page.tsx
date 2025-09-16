import Link from "next/link";
import { redirect } from "next/navigation";
import { createIssueAction } from "../actions";

export default function NewIssuePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Nova edição</h1>

      <form
        action={async (formData: FormData) => {
          "use server";
          // chama a server action que retorna { id, slug }
          const issue = await createIssueAction(formData);
          // após criar, redireciona para a página de edição da issue
          redirect(`/admin/issues/${issue.id}`);
        }}
        className="mt-6 space-y-4"
      >
        <div>
          <label className="block text-sm text-white/70">Título</label>
          <input
            name="title"
            className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-white/70">Assunto (subject)</label>
          <input
            name="subject"
            className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-white/70">Preheader</label>
          <input
            name="preheader"
            className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70">Agendar (opcional)</label>
          <input
            type="datetime-local"
            name="scheduledFor"
            className="mt-1 w-full rounded border border-white/15 bg-black px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button className="rounded bg-[#D427DEFF] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
            Criar
          </button>
          <Link
            href="/admin/issues"
            className="text-sm text-white/70 hover:text-white"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}
