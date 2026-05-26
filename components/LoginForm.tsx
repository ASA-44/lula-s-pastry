"use client";

import Link from "next/link";
import { useState } from "react";

import { loginAction } from "@/app/actions";
import {
  isPasswordRuleExempt,
  PasswordChecklist,
  passwordMeetsChecklistRules
} from "@/components/PasswordChecklist";

type LoginFormProps = {
  created?: string;
  error?: string;
};

export function LoginForm({ created, error }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [clientError, setClientError] = useState("");
  const isLulaAdmin = isPasswordRuleExempt(identifier, "lula@lulaspastry.com");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!isLulaAdmin && !passwordMeetsChecklistRules(password)) {
      event.preventDefault();
      setClientError("Password must be at least 8 characters with one capital letter and one special character.");
      return;
    }

    setClientError("");
  }

  return (
    <form action={loginAction} className="auth-card form-stack" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {(clientError || error) && <div className="error">{clientError || error}</div>}
      {created && <div className="notice">Account created. You can log in now.</div>}
      <div className="form-row">
        <label htmlFor="email_or_username">Email or username</label>
        <input
          id="email_or_username"
          name="email_or_username"
          placeholder="Enter your email or username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          onInput={(event) => setIdentifier(event.currentTarget.value)}
          suppressHydrationWarning
          required
        />
      </div>
      <PasswordChecklist
        mode="login"
        identifier={identifier}
        exemptIdentifier="lula@lulaspastry.com"
        password={password}
        onPasswordChange={setPassword}
      />
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
  );
}
