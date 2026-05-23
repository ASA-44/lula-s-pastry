"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

const passwordRules = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8
  },
  {
    label: "One capital letter",
    test: (password: string) => /[A-Z]/.test(password)
  },
  {
    label: "One special character",
    test: (password: string) => /[^A-Za-z0-9]/.test(password)
  }
];

export function PasswordChecklist() {
  const [password, setPassword] = useState("");
  const ruleStates = useMemo(
    () => passwordRules.map((rule) => ({ ...rule, valid: rule.test(password) })),
    [password]
  );

  return (
    <div className="form-row">
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        minLength={8}
        pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
        title="At least 8 characters, one capital letter, and one special character"
        placeholder="Create a strong password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <ul className="password-checklist" aria-live="polite">
        {ruleStates.map((rule) => (
          <li className={rule.valid ? "valid" : ""} key={rule.label}>
            <span className="password-check-icon" aria-hidden="true">
              {rule.valid && <Check size={14} strokeWidth={3} />}
            </span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
