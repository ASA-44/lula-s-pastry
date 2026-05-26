"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminSecretMessageProps = {
  show: boolean;
  message?: string;
};

export function AdminSecretMessage({
  show,
  message = "I accept payments from you but in a secret way."
}: AdminSecretMessageProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);
      router.replace("/admin/dashboard", { scroll: false });
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [router, show]);

  if (!visible) {
    return null;
  }

  function handleAnimationEnd() {
    setVisible(false);
    router.replace("/admin/dashboard", { scroll: false });
  }

  return (
    <div
      className="admin-secret-message"
      role="status"
      aria-live="polite"
      onAnimationEnd={handleAnimationEnd}
    >
      {message}
    </div>
  );
}
