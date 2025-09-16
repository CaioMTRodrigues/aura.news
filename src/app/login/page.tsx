"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMsg(null);

    try {
      const res = await signIn("email", { email, redirect: false });
      if (res?.ok) {
        setState("done");
        setMsg("Enviamos um link mágico para o seu e-mail. ✨");
      } else {
        setState("err");
        setMsg("Não conseguimos enviar o link. Tente novamente.");
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
          Entrar na <span className="text-[#D427DEFF]">Aura.news</span>
        </h1>
        <p className="mt-2 text-white/70">
          Digite seu e-mail e enviaremos um link mágico de acesso.
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
            type="submit"
            disabled={state === "loading"}
            className="w-full rounded bg-[#D427DEFF] text-black font-semibold py-3 hover:opacity-90 disabled:opacity-60"
          >
            {state === "loading" ? "Enviando..." : "Enviar link mágico"}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-3 text-sm ${
              state === "done" ? "text-green-400" : "text-red-400"
            }`}
          >
            {msg}
          </p>
        )}

        <div className="mt-6 text-sm text-white/50">
          <Link href="/" className="underline hover:text-white/80">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
