import { NextResponse } from "next/server";

import { checkPasswordRules, passwordMeetsRules } from "@/lib/password-rules";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: unknown };
  const password = typeof body.password === "string" ? body.password : "";

  return NextResponse.json({
    valid: passwordMeetsRules(password),
    rules: checkPasswordRules(password)
  });
}
