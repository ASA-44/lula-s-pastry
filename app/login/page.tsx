import { redirect } from "next/navigation";

import { loginAction, registerCustomerAction } from "@/app/actions";
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
            Customers, chefs, and the protected Lula admin all sign in here. The dashboard opens
            automatically based on the account role.
          </p>
          <div className="notice">
            Admin: lula@lulaspastry.com
            <br />
            Password: lula12345
          </div>
        </div>

        <div className="auth-grid">
          <form action={loginAction} className="auth-card form-stack">
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            {created && <div className="notice">Account created. You can log in now.</div>}
            <div className="form-row">
              <label htmlFor="email_or_username">Email or username</label>
              <input id="email_or_username" name="email_or_username" required />
            </div>
            <div className="form-row">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required />
            </div>
            <button className="primary-button" type="submit">
              Login
            </button>
          </form>

          <form action={registerCustomerAction} className="auth-card form-stack">
            <h2>New Customer</h2>
            <div className="form-row">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" required />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div className="form-row">
              <label htmlFor="register_password">Password</label>
              <input id="register_password" name="password" type="password" required />
            </div>
            <div className="form-row">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            <button className="primary-button" type="submit">
              Create Customer Account
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
