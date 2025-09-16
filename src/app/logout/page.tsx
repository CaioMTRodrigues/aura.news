"use client";

import { signOut } from "next-auth/react";

export default function LogoutPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded border border-white/10 p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Sair da Conta</h1>
        <p className="text-white/70 mb-6">
          Você tem certeza que deseja sair da{" "}
          <span className="text-[#D427DEFF] font-semibold">Aura.news</span>?
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full rounded bg-[#D427DEFF] text-black font-semibold py-3 hover:opacity-90"
        >
          Confirmar Logout
        </button>
      </div>
    </main>
  );
}
