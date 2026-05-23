import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getAvailableDishes } from "@/lib/data";
import { getDishesForMenuCategory, getMenuCategory } from "@/lib/menu";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function ProductCategoryPage({ params }: PageProps) {
  const session = await getSession();
  const { category: categorySlug } = await params;
  const category = getMenuCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const dishes = getDishesForMenuCategory(await getAvailableDishes(), category);
  const canOrder = session?.role === "customer";

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="section">
        <div className="page-title">
          <div>
            <p className="eyebrow">Menu Category</p>
            <h1>{category.title}</h1>
            <p>{category.subtitle}</p>
          </div>
          <Link href="/products" className="ghost-button">
            Back to Menu
          </Link>
        </div>

        {!canOrder && (
          <div className="notice menu-notice">
            <Link href="/login">Login</Link> as a customer to add items to your cart, or{" "}
            <Link href="/signin">sign in</Link> to create a customer account.
          </div>
        )}

        {dishes.length === 0 ? (
          <div className="empty-state">No available products in this category yet.</div>
        ) : (
          <div className="grid">
            {dishes.map((dish) => (
              <ProductCard key={dish.id} dish={dish} canOrder={canOrder} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
