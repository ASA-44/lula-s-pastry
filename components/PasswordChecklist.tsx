"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

type PasswordChecklistProps = {
  mode?: "signin" | "login";
  placeholder?: string;
  identifier?: string;
  exemptIdentifier?: string;
  password?: string;
  onPasswordChange?: (password: string) => void;
};

const specialCharacterPattern = /[!@#$%^&*]/;

export function isPasswordRuleExempt(identifier: string, exemptIdentifier?: string) {
  return Boolean(exemptIdentifier) && identifier.trim().toLowerCase() === exemptIdentifier?.toLowerCase();
}

export function passwordMeetsChecklistRules(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && specialCharacterPattern.test(password);
}

function validatePassword(pwd: string) {
  const hasCapital = /[A-Z]/.test(pwd);
  const hasSpecial = specialCharacterPattern.test(pwd);
  const hasMinLength = pwd.length >= 8;

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

export function PasswordChecklist({
  mode = "signin",
  placeholder = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
  identifier = "",
  exemptIdentifier,
  password: controlledPassword,
  onPasswordChange
}: PasswordChecklistProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledPassword, setUncontrolledPassword] = useState("");
  const password = controlledPassword ?? uncontrolledPassword;
  const setPassword = onPasswordChange ?? setUncontrolledPassword;
  const isExemptIdentifier =
    mode === "login" && isPasswordRuleExempt(identifier, exemptIdentifier);
  const enforcesRules = mode === "signin" || (mode === "login" && !isExemptIdentifier);
  const usesNativeRules = mode === "signin";
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasSpecial = specialCharacterPattern.test(password);
  const isPasswordValid = passwordMeetsChecklistRules(password);
  const passwordError = enforcesRules && password ? validatePassword(password) : "";

  function syncPassword(value: string) {
    setPassword(value);
  }

  useEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    syncPassword(input.value);

    const interval = window.setInterval(() => {
      syncPassword(input.value);
    }, 500);

    return () => {
      window.clearInterval(interval);
    };
  }, [setPassword]);

  return (
    <div className="space-y-2">
      <label className="text-foreground" htmlFor="password">
        Password
      </label>
      <input
        ref={inputRef}
        id="password"
        type="password"
        name="password"
        minLength={usesNativeRules ? 8 : undefined}
        pattern={usesNativeRules ? "(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}" : undefined}
        title="At least 8 characters, one capital letter, and one special character"
        onChange={(e) => syncPassword(e.target.value)}
        onInput={(e) => syncPassword(e.currentTarget.value)}
        onKeyUp={(e) => syncPassword(e.currentTarget.value)}
        onBlur={(e) => syncPassword(e.currentTarget.value)}
        onFocus={(e) => syncPassword(e.currentTarget.value)}
        onAnimationStart={(e) => syncPassword(e.currentTarget.value)}
        className={`w-full px-4 py-2 bg-input-background border rounded-lg focus:outline-none focus:ring-2 ${
          passwordError
            ? "border-red-500 focus:ring-red-500"
            : isPasswordValid
              ? "border-green-500 focus:ring-primary"
              : "border-border focus:ring-primary"
        }`}
        placeholder={placeholder}
        aria-invalid={enforcesRules && Boolean(passwordError)}
        aria-describedby={`${passwordError ? "password-error " : ""}password-requirements`}
        suppressHydrationWarning
        required
      />
      {enforcesRules && passwordError && (
        <div id="password-error" className="flex items-start gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{passwordError}</span>
        </div>
      )}
      {enforcesRules && (
      <div className="space-y-2 pt-2">
        <p className="text-sm text-muted-foreground">Password must contain:</p>
        <div id="password-requirements" className="space-y-1" aria-live="polite">
          <div className="flex items-center gap-2 text-sm">
            {hasMinLength ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
            )}
            <span className={hasMinLength ? "text-green-600" : "text-muted-foreground"}>
              At least 8 characters
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {hasCapital ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
            )}
            <span className={hasCapital ? "text-green-600" : "text-muted-foreground"}>
              One capital letter
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {hasSpecial ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
            )}
            <span className={hasSpecial ? "text-green-600" : "text-muted-foreground"}>
              One special character (!@#$%^&*)
            </span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
