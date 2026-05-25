import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { SignupForm } from "@/components/SignupForm";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function redirectForRole(role: string) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "chef") return "/chef/dashboard";
  return "/products";
}

export default async function SignInPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (session) {
    redirect(redirectForRole(session.role));
  }

  const params = (await searchParams) ?? {};
  const error = pick(params.error);

  return (
    <main className="page-shell">
      <SiteHeader session={session} />
      <SignupForm serverError={error} />
    </main>
  );
}
