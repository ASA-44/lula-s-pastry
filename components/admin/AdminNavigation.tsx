import Link from "next/link";
import {
  Bell,
  CircleUserRound,
  Cog,
  Croissant,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Plus,
  Search,
  ShoppingBag,
  UsersRound,
  UtensilsCrossed
} from "lucide-react";

import { logoutAction } from "@/app/actions";
import { Button } from "@/components/Button";
import type { SessionUser } from "@/lib/session";

export type AdminNavItem = "dashboard" | "orders" | "products" | "chefs" | "customers" | "settings";

type AdminNavigationProps = {
  active: AdminNavItem;
  notificationCount?: number;
  searchPlaceholder?: string;
  session?: SessionUser;
};

function activeClass(active: AdminNavItem, item: AdminNavItem) {
  return active === item ? "active" : undefined;
}

export function AdminSidebar({ active }: Pick<AdminNavigationProps, "active">) {
  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <Link href="/admin/dashboard" className="admin-sidebar-brand" aria-label="Lula's Pastry admin dashboard">
        <img src="/asssets/logo.png" alt="Lula's Pastry logo" />
        <span>
          <strong>Lula&apos;s Pastry</strong>
          <small>Admin Management</small>
        </span>
      </Link>

      <nav className="admin-sidebar-nav">
        <Link href="/admin/dashboard" className={activeClass(active, "dashboard")}>
          <LayoutDashboard size={23} />
          Dashboard
        </Link>
        <Link href="/admin/orders" className={activeClass(active, "orders")}>
          <ShoppingBag size={23} />
          Orders
        </Link>
        <Link href="/admin/products" className={activeClass(active, "products")}>
          <Croissant size={23} />
          Products
        </Link>
        <Link href="/admin/chefs" className={activeClass(active, "chefs")}>
          <UtensilsCrossed size={23} />
          Chefs
        </Link>
        <Link href="/admin/customers" className={activeClass(active, "customers")}>
          <UsersRound size={23} />
          Customers
        </Link>
        <Link href="/admin/settings" className={activeClass(active, "settings")}>
          <Cog size={23} />
          Settings
        </Link>
      </nav>

      <div className="admin-sidebar-bottom">
        <Button href="/admin/orders" className="admin-create-order-button">
          <Plus size={10} />
          Create New Order
        </Button>

        <div className="admin-profile">
          <img src="/asssets/logo.png" alt="Chef Lula" />
          <span>
            <strong>Chef Lula</strong>
            <small>Master Patissier</small>
          </span>
        </div>
      </div>
    </aside>
  );
}

export function AdminTopbar({
  notificationCount = 0,
  searchPlaceholder = "Search orders, products...",
  session
}: Omit<AdminNavigationProps, "active">) {
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
        <Link href="/" className="admin-account-link" title={session?.name ?? "Lula's Pastry"}>
          <span>{session?.name ?? "Lula's Pastry"}</span>
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
      <AdminSidebar active={active} />
      <AdminTopbar notificationCount={notificationCount} searchPlaceholder={searchPlaceholder} session={session} />
    </>
  );
}
