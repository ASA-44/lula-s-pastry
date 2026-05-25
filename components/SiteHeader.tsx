import Link from "next/link";
import { ChefHat, LogOut, ShieldCheck, ShoppingCart, Store } from "lucide-react";

import { logoutAction } from "@/app/actions";
import type { SessionUser } from "@/lib/session";

type SiteHeaderProps = {
  session: SessionUser | null;
};

export function SiteHeader({ session }: SiteHeaderProps) {
  const isCustomer = session?.role === "customer";
  const isChef = session?.role === "chef";
  const isAdmin = session?.role === "admin";

  return (
    <header className="site-header">
      <Link href="/" className="brand-link" aria-label="Lula's Pastry home">
        <img src="/asssets/logo.png" alt="Lula's Pastry logo" className="brand-logo" />
        <span>LULA&apos;S PASTRY</span>
      </Link>

      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/products">Menu</Link>
        {isCustomer && (
          <Link href="/cart" className="nav-icon-link">
            <ShoppingCart size={18} />
            Cart
          </Link>
        )}
        {isAdmin && (
          <Link href="/admin/dashboard" className="nav-icon-link">
            <ShieldCheck size={18} />
            Admin
          </Link>
        )}
        {(isChef || isAdmin) && (
          <>
            <Link href="/chef/dashboard" className="nav-icon-link">
              <ChefHat size={18} />
              Orders
            </Link>
            <Link href="/chef/products" className="nav-icon-link">
              <Store size={18} />
              Products
            </Link>
          </>
        )}
      </nav>

      <div className="header-actions">
        {session ? (
          <form action={logoutAction}>
            <button className="icon-button" type="submit" title="Logout">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </form>
        ) : (
          <>
            <Link href="/login" className="ghost-button">
              Login
            </Link>
            <Link href="/signin" className="primary-button small">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
