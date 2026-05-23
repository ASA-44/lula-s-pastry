import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { getAvailableDishes } from "@/lib/data";
import { getMenuPreviewItems, menuCategories } from "@/lib/menu";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const session = await getSession();
  const dishes = await getAvailableDishes();

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="menu-section">
        <div className="menu-heading">
          <h1>Our Menu</h1>
          <p>Explore our delicious selection</p>
        </div>

        <div className="menu-category-grid">
          {menuCategories.map((category) => (
            <Link href={`/products/${category.slug}`} className="menu-category-card" key={category.slug}>
              <h2>{category.title}</h2>
              <ul>
                {getMenuPreviewItems(dishes, category).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
