// src/app/archive/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ArchivePage() {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, title: true, createdAt: true },
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold">Edições Anteriores</h1>
        <p className="mt-2 text-white/70">Acompanhe todo o histórico da Aura.news.</p>
        <ul className="mt-8 space-y-4">
          {issues.map(i => (
            <li key={i.id} className="rounded border border-white/10 p-4 hover:bg-white/5">
              <Link href={`/issue/${i.slug}`} className="text-lg font-semibold text-[#D427DEFF]">
                {i.title}
              </Link>
              <div className="text-sm text-white/50">
                {new Date(i.createdAt).toLocaleDateString("pt-BR")}
              </div>
            </li>
          ))}
        </ul>
        {issues.length === 0 && (
          <p className="mt-8 text-white/50">Nenhuma edição ainda. Em breve 🚀</p>
        )}
      </main>
      <Footer />
    </>
  );
}
