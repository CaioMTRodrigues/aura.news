import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Política de Privacidade</h1>
        <p className="mt-2 text-white/70">
          Sua privacidade é importante para nós. Esta página explica como a Aura.news coleta,
          usa e protege suas informações.
        </p>
        <div className="mt-6 space-y-4 text-white/80">
          <p>
            1. Coletamos apenas os dados necessários para enviar nossa newsletter
            (como seu endereço de e-mail).
          </p>
          <p>
            2. Nunca compartilhamos seus dados com terceiros sem sua permissão.
          </p>
          <p>
            3. Você pode cancelar a inscrição a qualquer momento através do link no rodapé
            de cada edição.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
