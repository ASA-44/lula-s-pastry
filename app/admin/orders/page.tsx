import { redirect } from "next/navigation";

import { AdminOrdersSection } from "@/components/admin/AdminOrdersSection";
import { AdminShell } from "@/components/admin/AdminShell";
import { getOrders } from "@/lib/data";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const orders = await getOrders();
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  return (
    <AdminShell
      active="orders"
      notificationCount={pendingOrders}
      searchPlaceholder="Search orders..."
      session={session}
    >
      <AdminOrdersSection orders={orders} />
    </AdminShell>
  );
}
