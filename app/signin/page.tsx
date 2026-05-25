import { redirect } from "next/navigation";
import Link from "next/link";

import { registerCustomerAction } from "@/app/actions";
import { PasswordChecklist } from "@/components/PasswordChecklist";
import { SiteHeader } from "@/components/SiteHeader";
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

      <section className="auth-wrap">
        <div className="auth-copy">
          <p className="eyebrow">Customer sign in</p>
          <h1>Create your Lula&apos;s Pastry account.</h1>
          <p>
            Enter your first name and email, then create a strong password with at least 8
            characters, one capital letter, and one special character.
          </p>
          <Link href="/login" className="ghost-button">
            Already have an account?
          </Link>
        </div>

        <form action={registerCustomerAction} className="auth-card form-stack">
          <h2>Sign Up</h2>
          {error && <div className="error">{error}</div>}
          <div className="form-row">
            <label htmlFor="first_name">First name</label>
            <input id="first_name" name="first_name" placeholder="Enter your first name" required />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="customer@example.com"
              required
            />
          </div>
          <PasswordChecklist />
          <button
            className="primary-button !mt-4 !min-h-[72px] !rounded-[14px] !text-2xl"
            type="submit"
          >
            Create Account
          </button>
          <p className="auth-switch">
            If you already have an account, <Link href="/login">login</Link>.
          </p>
        </form>
      </section>
    </main>
  );
}
