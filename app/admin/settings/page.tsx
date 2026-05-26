import { redirect } from "next/navigation";

import { AdminSettingsSection } from "@/components/admin/AdminSettingsSection";
import { AdminShell } from "@/components/admin/AdminShell";
import { getOrders } from "@/lib/data";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const orders = await getOrders();
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  return (
    <AdminShell
      active="settings"
      notificationCount={pendingOrders}
      searchPlaceholder="Search settings..."
      session={session}
    >
      <AdminSettingsSection />
    </AdminShell>
  );
}
