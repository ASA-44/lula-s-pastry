import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { imagePath, money } from "@/lib/format";
import { getAvailableDishes } from "@/lib/data";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [session, dishes] = await Promise.all([getSession(), getAvailableDishes()]);
  const featuredDishes = dishes.slice(0, 3);

  return (
    <main className="home-screen">
      <SiteHeader session={session} />

      <section className="home-hero">
        <div className="home-hero-image" aria-hidden="true">
          <img src="/asssets/products/croissant.jpeg" alt="" />
          <div className="home-hero-overlay" />
        </div>

        <div className="home-container home-hero-content">
          <div className="home-hero-copy">
            <h1>
              Sweet moments
              <br />
              start here.
            </h1>
            <p>
              Experience the art of handcrafted pastries. From golden danishes to decadent cakes,
              every bite is a celebration of quality ingredients and traditional craft.
            </p>
            <div className="home-actions">
              <Link href="/products" className="home-primary-button">
                View Menu
              </Link>
              <Link href="/login" className="home-secondary-button">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-container" id="menu">
        <div className="home-section-header">
          <div>
            <span>Bestsellers</span>
            <h2>Popular Menu</h2>
          </div>
          <Link href="/products" className="home-text-link">
            Explore All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="home-product-grid">
          {featuredDishes.map((dish) => (
            <article className="home-product-card" key={dish.id}>
              <Link href="/products" className="home-product-image">
                <img src={imagePath(dish.image_url)} alt={dish.name} />
              </Link>
              <div className="home-product-content">
                <div className="home-product-title">
                  <h3>{dish.name}</h3>
                  <strong>{money(dish.price)}</strong>
                </div>
                <p>{dish.description ?? "Freshly prepared by Lula's pastry kitchen."}</p>
                <Link href="/products" className="home-card-button">
                  Add to Cart
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-about">
        <div className="home-container home-about-grid">
          <div className="home-about-media">
            <div className="home-about-main-image">
              <img src="/asssets/products/danish.jpeg" alt="Fresh pastries at Lula's Pastry" />
            </div>
            <div className="home-about-small-image">
              <img src="/asssets/products/apple_pie.jpeg" alt="Apple pie from Lula's Pastry" />
            </div>
          </div>

          <div className="home-about-copy">
            <span>Our Heritage</span>
            <h2>Elegance in every crumb.</h2>
            <p>
              Lula&apos;s Pastry began with a simple philosophy: use the finest ingredients and let
              them speak for themselves. Every dessert is prepared with care, from buttery
              croissants to celebration cakes.
            </p>
            <p>
              Our bakery is more than just a shop. It is a warm ordering experience designed to
              bring comfort, craft, and a touch of luxury to your daily routine.
            </p>
            <Link href="/products" className="home-underline-link">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="home-circle home-container">
        <div className="home-circle-panel">
          <h2>Join the Lula&apos;s Circle</h2>
          <p>Subscribe to receive exclusive offers, seasonal launches, and pastry updates.</p>
          <form className="home-subscribe-form">
            <input type="email" placeholder="your@email.com" aria-label="Email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
}
