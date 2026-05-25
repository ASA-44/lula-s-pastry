import Link from "next/link";
import {
  Bell,
  ChefHat,
  CircleUserRound,
  Cookie,
  Gauge,
  LogOut,
  PanelLeft,
  Search,
  Settings,
  ShoppingBag,
  Users
} from "lucide-react";

import { logoutAction } from "@/app/actions";
import { Button } from "@/components/Button";
import type { SessionUser } from "@/lib/session";

export type AdminNavItem = "dashboard" | "orders" | "products" | "chefs" | "settings";

type AdminNavigationProps = {
  active: AdminNavItem;
  notificationCount?: number;
  searchPlaceholder?: string;
  session: SessionUser;
};

function activeClass(active: AdminNavItem, item: AdminNavItem) {
  return active === item ? "active" : undefined;
}

export function AdminSidebar({ active, session }: Pick<AdminNavigationProps, "active" | "session">) {
  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <div className="admin-sidebar-brand">
        <img src="/asssets/logo.png" alt="Lula's Pastry logo" />
        <div>
          <h1>Lula&apos;s Pastry</h1>
          <p>Admin Management</p>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <Link href="/admin/dashboard" className={activeClass(active, "dashboard")}>
          <Gauge size={20} />
          Dashboard
        </Link>
        <Link href="/admin/orders" className={activeClass(active, "orders")}>
          <ShoppingBag size={20} />
          Orders
        </Link>
        <Link href="/admin/products" className={activeClass(active, "products")}>
          <Cookie size={20} />
          Products
        </Link>
        <Link href="/admin/chefs" className={activeClass(active, "chefs")}>
          <Users size={20} />
          Chefs
        </Link>
        <Link href="/admin/settings" className={activeClass(active, "settings")}>
          <Settings size={20} />
          Settings
        </Link>
      </nav>

      <div className="admin-profile">
        <div className="admin-profile-avatar">
          <ChefHat size={22} />
        </div>
        <div>
          <strong>{session.name}</strong>
          <span>{session.role === "admin" ? "Protected Admin" : "Pastry Chef"}</span>
        </div>
      </div>
    </aside>
  );
}

export function AdminTopbar({
  notificationCount = 0,
  searchPlaceholder = "Search orders, products..."
}: Omit<AdminNavigationProps, "active" | "session">) {
  return (
    <header className="admin-topbar">
      <div className="admin-mobile-brand">
        <Button type="button" variant="icon" aria-label="Open admin menu">
          <PanelLeft size={22} />
        </Button>
        <span>Lula&apos;s Admin</span>
      </div>

      <label className="admin-search">
        <Search size={18} />
        <input type="search" placeholder={searchPlaceholder} />
      </label>

      <div className="admin-topbar-actions">
        <Button type="button" variant="icon" aria-label="Notifications">
          <Bell size={20} />
          {notificationCount > 0 && <span aria-label={`${notificationCount} pending notifications`} />}
        </Button>
        <div className="admin-divider" />
        <Link href="/" className="admin-account-link">
          <span>Lula&apos;s Pastry</span>
          <CircleUserRound size={22} />
        </Link>
        <form action={logoutAction}>
          <Button type="submit" variant="icon" aria-label="Logout">
            <LogOut size={19} />
          </Button>
        </form>
      </div>
    </header>
  );
}

export function AdminNavigation({ active, notificationCount, searchPlaceholder, session }: AdminNavigationProps) {
  return (
    <>
      <AdminSidebar active={active} session={session} />
      <AdminTopbar notificationCount={notificationCount} searchPlaceholder={searchPlaceholder} />
    </>
  );
}
