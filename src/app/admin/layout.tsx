import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  if ((session.user as any).role !== "admin") redirect("/");

  return <section className="mx-auto max-w-6xl px-4 py-8">{children}</section>;
}
