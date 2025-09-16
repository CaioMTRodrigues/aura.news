import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubscribeForm from "@/components/SubscribeForm";

export default function SubscribePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4">
        <section className="mx-auto max-w-3xl py-16">
          <h1 className="text-4xl font-bold">Inscreva-se na <span className="text-[#D427DEFF]">Aura.news</span></h1>
          <p className="mt-3 text-white/70">
            De IA a gadgets: um resumo em 5 blocos, toda terça às 06:15 — direto no seu inbox.
          </p>
          <SubscribeForm />
          <p className="mt-4 text-sm text-white/40">
            Sem spam. Você pode cancelar quando quiser.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
