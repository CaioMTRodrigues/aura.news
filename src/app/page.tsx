import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function Home() {
  // Última edição (se existir). Se o DB estiver fora do ar, caímos no fallback.
  let lastIssue:
    | { slug: string; title: string; preheader: string | null; createdAt: Date }
    | null = null;

  try {
    lastIssue = await prisma.issue.findFirst({
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true, preheader: true, createdAt: true },
    });
  } catch (err) {
    // Evita crash da página quando o Postgres não está acessível
    console.error("[home] Falha ao buscar última edição:", err);
    lastIssue = null;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4">
        <section className="grid min-h-[60vh] place-items-center text-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold">
              Aura.news — <span className="text-[#D427DEFF]">tech sem enrolação</span>
            </h1>
            <p className="mt-3 text-white/70">
              IA, Startups, Dev Hacks, Gadgets, Mercado Tech e Futuro do Trabalho.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                href="/subscribe"
                className="rounded bg-[#D427DEFF] px-5 py-2.5 font-medium text-black hover:opacity-90"
              >
                Assinar grátis
              </Link>

              {lastIssue && (
                <Link
                  href={`/issue/${lastIssue.slug}`}
                  className="rounded border border-white/15 px-5 py-2.5 font-medium hover:bg-white/5"
                >
                  Ler última edição
                </Link>
              )}
            </div>

            {!lastIssue && (
              <p className="mt-6 text-sm text-white/50">
                (Sem edições publicadas ainda ou banco indisponível no momento.)
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
