"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

type PasswordChecklistProps = {
  mode?: "signin" | "login";
  placeholder?: string;
};

const specialCharacterPattern = /[!@#$%^&*]/;

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
  placeholder = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
}: PasswordChecklistProps) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const enforcesRules = mode === "signin";
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasSpecial = specialCharacterPattern.test(password);

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordError(validatePassword(pwd));
  }

  return (
    <div className="space-y-2">
      <label className="text-foreground" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        name="password"
        value={password}
        minLength={enforcesRules ? 8 : undefined}
        pattern={enforcesRules ? "(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}" : undefined}
        title="At least 8 characters, one capital letter, and one special character"
        onChange={handlePasswordChange}
        className={`w-full px-4 py-2 bg-input-background border rounded-lg focus:outline-none focus:ring-2 ${
          passwordError
            ? "border-red-500 focus:ring-red-500"
            : password
              ? "border-green-500 focus:ring-primary"
              : "border-border focus:ring-primary"
        }`}
        placeholder={placeholder}
        aria-invalid={Boolean(passwordError)}
        aria-describedby={`${passwordError ? "password-error " : ""}password-requirements`}
        required
      />
      {passwordError && (
        <div id="password-error" className="flex items-start gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{passwordError}</span>
        </div>
      )}
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
    </div>
  );
}
