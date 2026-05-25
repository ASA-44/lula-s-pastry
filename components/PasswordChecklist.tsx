"use client";

import { useState } from "react";

import { checkPasswordRules } from "@/lib/password-rules";

type PasswordChecklistProps = {
  mode?: "signin" | "login";
  placeholder?: string;
};

const ruleDisplayText = {
  minLength: "At least 8 characters",
  capital: "One capital letter",
  special: "One special character (!@#$%^&*)"
};

const ruleErrorText = {
  minLength: "at least 8 characters",
  capital: "at least one capital letter",
  special: "at least one special character"
};

export function PasswordChecklist({
  mode = "signin",
  placeholder = mode === "login" ? "Enter your password" : "Create a strong password"
}: PasswordChecklistProps) {
  const [password, setPassword] = useState("");
  const ruleStates = checkPasswordRules(password);
  const missingRule = password.length > 0 ? ruleStates.find((rule) => !rule.valid) : undefined;
  const hasError = Boolean(missingRule);
  const enforcesRules = mode === "signin";

  return (
    <div className="form-row">
      <label htmlFor="password">Password</label>

      <input
        id="password"
        name="password"
        type="password"
        value={password}
        minLength={enforcesRules ? 8 : undefined}
        pattern={enforcesRules ? "(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}" : undefined}
        title="At least 8 characters, one capital letter, and one special character"
        placeholder={placeholder}
        className={`!min-h-[68px] !rounded-[18px] !px-6 !text-[1.25rem] !outline-none transition-colors ${
          hasError
            ? "!border-2 !border-red-500 focus:!border-red-500"
            : "!border !border-[var(--line)] focus:!border-[var(--primary)]"
        }`}
        aria-invalid={hasError}
        aria-describedby={`${hasError ? "password-error " : ""}password-requirements`}
        onInput={(event) => setPassword(event.currentTarget.value)}
        onChange={(event) => setPassword(event.currentTarget.value)}
        required
      />

      {hasError && missingRule && (
        <p
          id="password-error"
          className="mt-3 flex items-center gap-3 text-base font-medium text-red-600"
        >
          <span
            className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-red-600 text-sm font-bold leading-none"
            aria-hidden="true"
          >
            !
          </span>
          Password must contain {ruleErrorText[missingRule.id]}
        </p>
      )}

      <p className="mt-6 text-lg font-medium text-[var(--muted)]">Password must contain:</p>

      <ul id="password-requirements" className="mt-3 grid gap-3 text-lg" aria-live="polite">
        {ruleStates.map((rule) => (
          <li
            key={rule.id}
            className={`flex items-center gap-3 ${
              rule.valid ? "text-green-600" : "text-[var(--muted)]"
            }`}
          >
            <span
              className={`inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 text-sm font-black leading-none transition-colors ${
                rule.valid
                  ? "border-green-600 text-green-600"
                  : "border-[var(--muted)] text-transparent"
              }`}
              aria-hidden="true"
            >
              {rule.valid ? "\u2713" : ""}
            </span>

            <span>{ruleDisplayText[rule.id]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
