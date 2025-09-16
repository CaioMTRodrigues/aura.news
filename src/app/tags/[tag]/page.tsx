// src/app/tags/[tag]/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

const allowed = new Set([
  "IA", "Startups", "DevHacks", "Gadgets", "MercadoTech", "FuturoDoTrabalho",
]);

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = params.tag;
  if (!allowed.has(tag)) return notFound();

  // Busca issues que têm pelo menos um CuratedItem nessa categoria
  const issues = await prisma.issue.findMany({
    where: {
      curatedItems: { some: { category: tag as any } },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, title: true, createdAt: true },
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold">Tema: <span className="text-[#D427DEFF]">{tag}</span></h1>
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
          <p className="mt-8 text-white/50">Ainda não temos edições com esse tema.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
