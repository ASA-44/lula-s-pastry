import { redirect } from "next/navigation";

import { ProductCard } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getAvailableDishes } from "@/lib/data";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    redirect("/login");
  }

  const dishes = await getAvailableDishes();

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="section">
        <div className="page-title">
          <div>
            <p className="eyebrow">Welcome, {session.name}</p>
            <h1>Our Menu</h1>
            <p>Choose your favorite pastries, cakes, pies, and muffins.</p>
          </div>
        </div>

        {dishes.length === 0 ? (
          <div className="empty-state">No available dishes yet.</div>
        ) : (
          <div className="grid">
            {dishes.map((dish) => (
              <ProductCard key={dish.id} dish={dish} canOrder />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
