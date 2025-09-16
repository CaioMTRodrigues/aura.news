"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const leftLinks = [
  { href: "/", label: "Início" },
  { href: "/archive", label: "Edições" },
  { href: "/tags", label: "Temas" },
  { href: "/author", label: "Sobre" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (href: string) =>
    pathname === href ? "text-[#D427DEFF]" : "text-white/80";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#D427DEFF]">
          Aura.news
        </Link>

        {/* Links principais */}
        <ul className="hidden gap-4 text-sm sm:flex">
          {leftLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`px-2 py-1 rounded hover:bg-white/5 ${isActive(l.href)}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Área de login/logout */}
        <div className="flex items-center gap-3">
          {status === "authenticated" && session?.user ? (
            <>
              <Link
                href="/admin"
                className="rounded border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5"
              >
                Admin
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded bg-[#D427DEFF] px-3 py-1.5 text-sm font-semibold text-black hover:opacity-90"
                title={session.user.email ?? "Sair"}
              >
                Logout
              </button>

              {/* Avatar com inicial do nome/email */}
              <div
                className="hidden h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs sm:flex"
                title={session.user.email ?? ""}
              >
                {(session.user.name ?? session.user.email ?? "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded bg-[#D427DEFF] px-3 py-1.5 text-sm font-semibold text-black hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
