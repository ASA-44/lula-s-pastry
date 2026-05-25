"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "lulas_admin_secret_seen";

type AdminSecretMessageProps = {
  show: boolean;
  message?: string;
};

export function AdminSecretMessage({
  show,
  message = "We accept payments by secret things between us 😜"
}: AdminSecretMessageProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      return;
    }

    if (sessionStorage.getItem(STORAGE_KEY)) {
      router.replace("/admin/dashboard", { scroll: false });
      return;
    }

    setVisible(true);
    sessionStorage.setItem(STORAGE_KEY, "1");

    const timer = window.setTimeout(() => {
      setVisible(false);
      router.replace("/admin/dashboard", { scroll: false });
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [router, show]);

  if (!visible) {
    return null;
  }

  return (
    <div className="admin-secret-message" role="status" aria-live="polite">
      {message}
    </div>
  );
}
