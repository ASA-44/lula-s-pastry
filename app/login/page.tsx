import { redirect } from "next/navigation";
import Link from "next/link";

import { loginAction } from "@/app/actions";
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

export default async function LoginPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (session) {
    redirect(redirectForRole(session.role));
  }

  const params = (await searchParams) ?? {};
  const error = pick(params.error);
  const created = pick(params.created);

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="auth-wrap">
        <div className="auth-copy">
          <p className="eyebrow">One secure login</p>
          <h1>Welcome back to Lula&apos;s Pastry.</h1>
          <p>
            Customers, chefs, and the protected Lula admin all login here. The dashboard opens
            automatically based on your account role.
          </p>
          <Link href="/signin" className="ghost-button">
            Create customer account
          </Link>
        </div>

        <form action={loginAction} className="auth-card form-stack">
          <h2>Login</h2>
          {error && <div className="error">{error}</div>}
          {created && <div className="notice">Account created. You can log in now.</div>}
          <div className="form-row">
            <label htmlFor="email_or_username">Email or username</label>
            <input
              id="email_or_username"
              name="email_or_username"
              placeholder="Enter your email or username"
              suppressHydrationWarning
              required
            />
          </div>
          <PasswordChecklist mode="login" />
          <button
            className="primary-button !mt-4 !min-h-[72px] !rounded-[14px] !text-2xl"
            type="submit"
            suppressHydrationWarning
          >
            Login
          </button>
          <p className="auth-switch">
            If you don&apos;t have an account, please <Link href="/signin">SignUp</Link>.
          </p>
        </form>
      </section>
    </main>
  );
}
