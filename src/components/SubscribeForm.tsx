"use client";
import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMsg(null);
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Erro ao inscrever");
      setState("ok");
      setMsg("Pronto! Você está inscrito. 🎉");
      setEmail("");
    } catch (err: any) {
      setState("err");
      setMsg(err.message || "Erro inesperado. Tente novamente.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        placeholder="seu@email.com"
        className="w-full rounded border border-white/20 bg-black px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D427DEFF]"
        required
      />
      <button
        className="rounded bg-[#D427DEFF] px-5 py-3 font-semibold text-black hover:opacity-90 disabled:opacity-60"
        disabled={state==="loading"}
      >
        {state==="loading" ? "Enviando..." : "Quero receber!"}
      </button>
      {msg && (
        <div className={`w-full sm:w-auto text-sm ${state==="ok" ? "text-green-400" : "text-red-400"}`}>
          {msg}
        </div>
      )}
    </form>
  );
}
