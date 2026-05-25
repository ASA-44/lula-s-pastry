export type PasswordRule = {
  id: "minLength" | "capital" | "special";
  label: string;
  valid: boolean;
};

const passwordRules = [
  {
    id: "minLength",
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8
  },
  {
    id: "capital",
    label: "At least one capital letter",
    test: (password: string) => /[A-Z]/.test(password)
  },
  {
    id: "special",
    label: "At least one special character",
    test: (password: string) => /[!@#$%^&*]/.test(password)
  }
] as const;

export function checkPasswordRules(password: string): PasswordRule[] {
  return passwordRules.map((rule) => ({
    id: rule.id,
    label: rule.label,
    valid: rule.test(password)
  }));
}

export function passwordMeetsRules(password: string) {
  return checkPasswordRules(password).every((rule) => rule.valid);
}
