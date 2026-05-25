import { redirect } from "next/navigation";

import { AdminProductsSection, getAdminProductCategories } from "@/components/admin/AdminProductsSection";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAllDishes } from "@/lib/data";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const dishes = await getAllDishes();
  const categories = getAdminProductCategories(dishes);
  const outOfStockCount = dishes.filter((dish) => !dish.available).length;

  return (
    <AdminShell
      active="products"
      notificationCount={outOfStockCount}
      searchPlaceholder="Search products..."
      session={session}
    >
      <AdminProductsSection categories={categories} dishes={dishes} />
    </AdminShell>
  );
}
