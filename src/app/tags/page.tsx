// src/app/tags/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const tags = [
  { key: "IA", label: "IA" },
  { key: "Startups", label: "Startups" },
  { key: "DevHacks", label: "Dev Hacks" },
  { key: "Gadgets", label: "Gadgets" },
  { key: "MercadoTech", label: "Mercado Tech" },
  { key: "FuturoDoTrabalho", label: "Futuro do Trabalho" },
];

export default function TagsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold">Temas</h1>
        <p className="mt-2 text-white/70">Explore os conteúdos por categoria.</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {tags.map(t => (
            <Link
              key={t.key}
              href={`/tags/${t.key}`}
              className="rounded border border-white/10 p-6 hover:bg-white/5"
            >
              <div className="text-lg font-semibold text-[#D427DEFF]">{t.label}</div>
              <div className="text-sm text-white/60 mt-1">Ver edições</div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
