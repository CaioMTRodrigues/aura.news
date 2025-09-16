export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="text-2xl font-semibold text-[#D427DEFF]">Aura.news</div>
        <p className="mt-2 text-white/70">
          Seu radar semanal de tecnologia e inovação — em 5 blocos, sem ruído.
        </p>
        <p className="mt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Aura.news — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
