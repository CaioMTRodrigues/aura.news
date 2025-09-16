export default function VerifyPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded border border-white/10 p-6 text-center">
        <h1 className="text-2xl font-bold">Verifique seu e-mail 📬</h1>
        <p className="mt-2 text-white/70">
          Enviamos um link mágico para você. Clique nele para entrar na{" "}
          <span className="text-[#D427DEFF] font-semibold">Aura.news</span>.
        </p>
        <p className="mt-6 text-sm text-white/50">
          Se não encontrar, confira a pasta de spam ou promoções.
        </p>
      </div>
    </main>
  );
}
