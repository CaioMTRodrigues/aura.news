import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold">Termos de Uso</h1>
        <p className="mt-2 text-white/70">
          Ao se inscrever e utilizar a Aura.news, você concorda com os seguintes termos.
        </p>
        <div className="mt-6 space-y-4 text-white/80">
          <p>
            1. A Aura.news fornece conteúdos semanais sobre tecnologia, sem garantias de
            disponibilidade ou continuidade do serviço.
          </p>
          <p>
            2. Você concorda em não utilizar o conteúdo da newsletter de forma ilegal
            ou para fins de spam.
          </p>
          <p>
            3. Podemos atualizar estes termos periodicamente, e continuando a usar
            nossos serviços, você concorda com as alterações.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
