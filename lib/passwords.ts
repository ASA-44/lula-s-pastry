import "server-only";

import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, storedPassword: string) {
  if (!storedPassword) {
    return false;
  }

  if (storedPassword.startsWith("$2")) {
    try {
      const compatibleHash = storedPassword.replace(/^\$2y\$/, "$2a$");
      return await bcrypt.compare(password, compatibleHash);
    } catch {
      return false;
    }
  }

  return password === storedPassword;
}
