import { redirect } from "next/navigation";

import { AdminCustomersSection } from "@/components/admin/AdminCustomersSection";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCustomers, getOrders } from "@/lib/data";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const [orders, customers] = await Promise.all([getOrders(), getCustomers()]);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  return (
    <AdminShell
      active="customers"
      notificationCount={pendingOrders}
      searchPlaceholder="Search customers..."
      session={session}
    >
      <AdminCustomersSection customers={customers} />
    </AdminShell>
  );
}
