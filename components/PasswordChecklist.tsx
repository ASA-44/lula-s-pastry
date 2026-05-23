"use client";

import { useState } from "react";

import { checkPasswordRules } from "@/lib/password-rules";

export function PasswordChecklist() {
  const [password, setPassword] = useState("");
  const ruleStates = checkPasswordRules(password);

  return (
    <div className="form-row">
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={password}
        minLength={8}
        pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
        title="At least 8 characters, one capital letter, and one special character"
        placeholder="Create a strong password"
        onChange={(event) => setPassword(event.currentTarget.value)}
        required
      />
      <ul className="mt-2 grid gap-2 text-sm font-bold" aria-live="polite">
        {ruleStates.map((rule) => (
          <li
            className={`flex items-center gap-2 ${
              rule.valid ? "text-green-700" : "text-[var(--muted)]"
            }`}
            key={rule.id}
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs font-black transition-colors ${
                rule.valid
                  ? "border-green-700 bg-green-100 text-green-700"
                  : "border-gray-300 bg-white text-transparent"
              }`}
              aria-hidden="true"
            >
              {rule.valid ? "\u2713" : ""}
            </span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
