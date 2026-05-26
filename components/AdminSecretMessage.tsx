"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminSecretMessageProps = {
  show: boolean;
  message?: string;
};

export function AdminSecretMessage({
  show,
  message = "We accept payments through Snapchat 😜"
}: AdminSecretMessageProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      return;
    }

    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);
      router.replace("/admin/dashboard", { scroll: false });
    }, 2000);

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
