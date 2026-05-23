"use client";

import { useEffect, useRef, useState } from "react";

import type { PasswordRule } from "@/lib/password-rules";

const defaultRules: PasswordRule[] = [
  { id: "minLength", label: "At least 8 characters", valid: false },
  { id: "capital", label: "At least one capital letter", valid: false },
  { id: "special", label: "At least one special character", valid: false }
];

export function PasswordChecklist() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ruleStates, setRuleStates] = useState<PasswordRule[]>(defaultRules);

  async function checkPasswordWithApi(password: string, signal?: AbortSignal) {
    const response = await fetch("/api/password-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password }),
      signal
    });

    if (!response.ok) {
      return;
    }

    const result = (await response.json()) as { rules?: PasswordRule[] };
    if (result.rules) {
      setRuleStates(result.rules);
    }
  }

  function updatePassword(signal?: AbortSignal) {
    void checkPasswordWithApi(inputRef.current?.value ?? "", signal);
  }

  useEffect(() => {
    const controller = new AbortController();
    updatePassword(controller.signal);
    return () => controller.abort();
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
        onInput={() => updatePassword()}
        onChange={() => updatePassword()}
        required
      />
      <ul className="password-checklist" aria-live="polite">
        {ruleStates.map((rule) => (
          <li className={rule.valid ? "valid" : "invalid"} key={rule.label}>
            <span className="password-check-icon" aria-hidden="true">
              {rule.valid ? "\u2713" : ""}
            </span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
