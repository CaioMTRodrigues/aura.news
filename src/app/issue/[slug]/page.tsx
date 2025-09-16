// src/app/issue/[slug]/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function IssuePage({ params }: { params: { slug: string } }) {
  const issue = await prisma.issue.findUnique({
    where: { slug: params.slug },
    include: { draft: true },
  });

  if (!issue || !issue.draft) return notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">{issue.title}</h1>
        <p className="mt-2 text-white/60">{issue.preheader}</p>
        <article
          className="prose prose-invert mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: issue.draft.html }}
        />
      </main>
      <Footer />
    </>
  );
}
