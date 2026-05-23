import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getAvailableDishes } from "@/lib/data";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [session, dishes] = await Promise.all([getSession(), getAvailableDishes()]);
  const featuredDishes = dishes.slice(0, 3);

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Fresh bakery orders</p>
          <h1>Sweet moments start here.</h1>
          <p>
            Lula&apos;s Pastry brings freshly baked cakes, pies, muffins, and pastries into one
            responsive ordering experience for customers, chefs, and the protected Lula admin.
          </p>
          <div className="hero-actions">
            <Link href="/products" className="primary-button">
              View Menu
            </Link>
            <Link href="/login" className="ghost-button">
              Login
            </Link>
            <Link href="/signin" className="ghost-button">
              Sign In
            </Link>
          </div>
        </div>

        <div className="hero-media">
          <img src="/asssets/products/chocolate_cake.jpeg" alt="Chocolate cake" />
          <div className="hero-note">Baked fresh, ordered online, managed by chefs.</div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="section-header">
          <h2>About Us</h2>
        </div>
        <p className="lead-text">
          At Lula&apos;s Pastry, every dessert is prepared with care, from buttery croissants to
          celebration cakes. The new Next.js version keeps the same project idea while making the
          experience faster, typed, and responsive on mobile and desktop.
        </p>
      </section>

      <section className="section" id="menu">
        <div className="section-header">
          <h2>Popular Menu</h2>
          <Link href="/products" className="ghost-button">
            See All
          </Link>
        </div>
        <div className="grid">
          {featuredDishes.map((dish) => (
            <ProductCard key={dish.id} dish={dish} />
          ))}
        </div>
      </section>

    </main>
  );
}
