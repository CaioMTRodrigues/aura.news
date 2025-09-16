import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AuthorPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Quem está por trás do teclado</h1>
        <p className="mt-2 text-white/70">A mente curiosa por trás da Aura.news.</p>
        <div className="mt-6 space-y-4 text-white/80">
          <p>Bio do autor aqui. Sua experiência, foco, e por que criou a Aura.news.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
