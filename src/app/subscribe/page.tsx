"use client";

import { useState } from "react";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMsg(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setState("ok");
        setMsg(
          json.mode === "double"
            ? "Quase lá! Enviamos um e-mail para você confirmar a inscrição. 📬"
            : "Inscrição concluída! Você já está na lista. ✅"
        );
        setEmail("");
      } else {
        setState("err");
        setMsg(json.error || "Não foi possível inscrever. Tente novamente.");
      }
    } catch (err) {
      setState("err");
      setMsg("Erro inesperado. Tente novamente.");
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded border border-white/10 p-6">
        <h1 className="text-2xl font-bold">
          Assine a <span className="text-[#D427DEFF]">Aura.news</span>
        </h1>
        <p className="mt-2 text-white/70">
          Receba o melhor de IA, Startups, Dev Hacks, Gadgets, Mercado Tech e Futuro do Trabalho.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-white/20 bg-black px-4 py-3 placeholder-white/40 outline-none focus:ring-2 focus:ring-[#D427DEFF]"
            required
          />
          <button
            disabled={state === "loading"}
            className="w-full rounded bg-[#D427DEFF] text-black font-semibold py-3 hover:opacity-90 disabled:opacity-60"
          >
            {state === "loading" ? "Enviando..." : "Inscrever"}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-3 text-sm ${
              state === "ok" ? "text-green-400" : "text-red-400"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </main>
  );
}
