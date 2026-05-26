import { redirect } from "next/navigation";

import { AdminDashboardOverview } from "@/components/admin/AdminDashboardOverview";
import { AdminSecretMessage } from "@/components/admin/AdminSecretMessage";
import { AdminShell } from "@/components/admin/AdminShell";
import { getOrders, getTopSellingDish } from "@/lib/data";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const [orders, topSellingDish] = await Promise.all([getOrders(), getTopSellingDish()]);
  const params = (await searchParams) ?? {};
  const showSecret = pick(params.secret) === "1";
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  return (
    <AdminShell
      active="dashboard"
      notificationCount={pendingOrders}
      searchPlaceholder="Search dashboard..."
      session={session}
    >
      <AdminSecretMessage
        show={showSecret}
        message='I accept payments from you but in a secret way. "No one will know about it"... our sweet little secret forever? CASH is not acceptable.'
      />
      <AdminDashboardOverview orders={orders} topSellingDish={topSellingDish} />
    </AdminShell>
  );
}
