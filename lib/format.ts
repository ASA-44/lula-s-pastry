import type { OrderStatus } from "@/types/database";

export function money(value: number | string | null | undefined) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}

export function imagePath(path: string | null | undefined) {
  if (!path) {
    return "/asssets/logo.png";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function niceDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function statusClass(status: OrderStatus | string | null | undefined) {
  if (status === "confirmed") return "status confirmed";
  if (status === "rejected" || status === "cancelled") return "status rejected";
  if (status === "pending") return "status pending";
  return "status other";
}
