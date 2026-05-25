import { redirect } from "next/navigation";

import { AdminChefsSection } from "@/components/admin/AdminChefsSection";
import { AdminShell } from "@/components/admin/AdminShell";
import { getChefs, getOrders } from "@/lib/data";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminChefsPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const [orders, chefs] = await Promise.all([getOrders(), getChefs()]);
  const params = (await searchParams) ?? {};
  const error = pick(params.error);
  const chefCreated = pick(params.chefCreated);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  return (
    <AdminShell active="chefs" notificationCount={pendingOrders} searchPlaceholder="Search chefs..." session={session}>
      <AdminChefsSection chefCreated={chefCreated} chefs={chefs} error={error} />
    </AdminShell>
  );
}
