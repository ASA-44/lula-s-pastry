"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle } from "lucide-react";

import { registerCustomerAction } from "@/app/actions";

type SignupFormProps = {
  serverError?: string;
};

function validatePassword(password: string) {
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasMinLength) {
    return "Password must be at least 8 characters long";
  }

  if (!hasCapital) {
    return "Password must contain at least one capital letter";
  }

  if (!hasSpecial) {
    return "Password must contain at least one special character";
  }

  return "";
}

function RequirementRow({
  valid,
  children
}: Readonly<{ valid: boolean; children: React.ReactNode }>) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {valid ? (
        <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
      ) : (
        <span className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-[var(--muted)]" />
      )}
      <span className={valid ? "text-green-600" : "text-[var(--muted)]"}>{children}</span>
    </div>
  );
}

export function SignupForm({ serverError }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordIsValid = password.length > 0 && !passwordError;

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextPassword = event.target.value;
    setPassword(nextPassword);
    setPasswordError(validatePassword(nextPassword));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const error = validatePassword(password);

    if (error) {
      event.preventDefault();
      setPasswordError(error);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-78px)] items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/asssets/logo.png"
            alt="Lula's Pastry"
            className="mx-auto mb-4 h-24 w-24 object-contain"
          />
          <h1 className="mb-2 text-3xl text-[var(--text)]">Create Account</h1>
          <p className="text-[var(--muted)]">Join Lula&apos;s Pastry today</p>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--page)] p-8 shadow-[var(--shadow)]">
          <form action={registerCustomerAction} className="space-y-6" onSubmit={handleSubmit}>
            {serverError && <div className="error">{serverError}</div>}

            <div className="space-y-2">
              <label className="text-[var(--text)]" htmlFor="first_name">
                Full Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[var(--text)]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[var(--text)]" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full rounded-lg border bg-white px-4 py-2 text-[var(--text)] focus:outline-none focus:ring-2 ${
                  passwordError
                    ? "border-red-500 focus:ring-red-500"
                    : passwordIsValid
                      ? "border-green-500 focus:ring-[var(--primary)]"
                      : "border-[var(--line)] focus:ring-[var(--primary)]"
                }`}
                placeholder="********"
                required
              />

              {passwordError && (
                <div className="flex items-start gap-2 text-sm text-red-600">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <p className="text-sm text-[var(--muted)]">Password must contain:</p>
                <div className="space-y-1">
                  <RequirementRow valid={hasMinLength}>At least 8 characters</RequirementRow>
                  <RequirementRow valid={hasCapital}>One capital letter</RequirementRow>
                  <RequirementRow valid={hasSpecial}>
                    One special character (!@#$%^&*)
                  </RequirementRow>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--primary)] px-6 py-3 font-bold text-white transition-colors hover:bg-[var(--primary-dark)]"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--muted)]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--primary-dark)] underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-[var(--muted)] transition-colors hover:text-[var(--primary-dark)]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
