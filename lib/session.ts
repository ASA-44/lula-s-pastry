import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

import type { UserRole } from "@/types/database";

const COOKIE_NAME = "lulas_session";
const ONE_WEEK = 60 * 60 * 24 * 7;

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

function getSecret() {
  return process.env.SESSION_SECRET ?? "lulas-pastry-dev-secret";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function createToken(session: SessionUser) {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function readToken(value: string | undefined): SessionUser | null {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");
  if (!payload || !signature || sign(payload) !== signature) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  return readToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function setSession(session: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createToken(session), {
    httpOnly: true,
    maxAge: ONE_WEEK,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
