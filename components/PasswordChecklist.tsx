"use client";

import { useEffect, useRef, useState } from "react";

const passwordRules = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8
  },
  {
    label: "At least one capital letter",
    test: (password: string) => /[A-Z]/.test(password)
  },
  {
    label: "At least one special character",
    test: (password: string) => /[^A-Za-z0-9]/.test(password)
  }
];

export function PasswordChecklist() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const ruleStates = passwordRules.map((rule) => ({ ...rule, valid: rule.test(password) }));

  function updatePassword() {
    setPassword(inputRef.current?.value ?? "");
  }

  useEffect(() => {
    updatePassword();
    const timeoutId = window.setTimeout(updatePassword, 250);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="form-row">
      <label htmlFor="password">Password</label>
      <input
        id="password"
        ref={inputRef}
        name="password"
        type="password"
        minLength={8}
        pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
        title="At least 8 characters, one capital letter, and one special character"
        placeholder="Create a strong password"
        onInput={updatePassword}
        onChange={updatePassword}
        required
      />
      <ul className="password-checklist" aria-live="polite">
        {ruleStates.map((rule) => (
          <li className={rule.valid ? "valid" : "invalid"} key={rule.label}>
            <span className="password-check-icon" aria-hidden="true">
              {rule.valid ? "✓" : ""}
            </span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
