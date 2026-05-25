import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  Cookie,
  CreditCard,
  Gauge,
  LogOut,
  MoreVertical,
  Package,
  PanelLeft,
  Printer,
  ReceiptText,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Store,
  TrendingUp,
  Users,
  X
} from "lucide-react";

import { createChefAction, logoutAction, updateOrderStatusAction } from "@/app/actions";
import { AdminSecretMessage } from "@/components/AdminSecretMessage";
import { getChefs, getOrders, getTopSellingDish } from "@/lib/data";
import { money, niceDate } from "@/lib/format";
import { getSession } from "@/lib/session";
import type { OrderStatus } from "@/types/database";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isToday(value: Date | string | null | undefined) {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function orderStatusClass(status: OrderStatus) {
  if (status === "delivered" || status === "confirmed" || status === "ready") {
    return "admin-status admin-status-success";
  }

  if (status === "cancelled" || status === "rejected") {
    return "admin-status admin-status-danger";
  }

  return "admin-status admin-status-warning";
}

function statusLabel(status: OrderStatus) {
  return status.replace(/_/g, " ");
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const [orders, chefs, topSellingDish] = await Promise.all([getOrders(), getChefs(), getTopSellingDish()]);
  const params = (await searchParams) ?? {};
  const error = pick(params.error);
  const chefCreated = pick(params.chefCreated);
  const showSecret = pick(params.secret) === "1";

  const todaysOrders = orders.filter((order) => isToday(order.order_date));
  const todaysSales = todaysOrders.reduce((total, order) => total + order.total_amount, 0);
  const completedToday = todaysOrders.filter((order) =>
    ["confirmed", "ready", "delivered"].includes(order.status)
  ).length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const recentOrders = orders.slice(0, 5);

  return (
    <main className="admin-dashboard-shell">
      <AdminSecretMessage show={showSecret} />

      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-brand">
          <img src="/asssets/logo.png" alt="Lula's Pastry logo" />
          <div>
            <h1>Lula&apos;s Admin</h1>
            <p>Management Portal</p>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <Link href="/admin/dashboard" className="active">
            <Gauge size={20} />
            Dashboard
          </Link>
          <a href="#orders">
            <ShoppingBag size={20} />
            Orders
          </a>
          <Link href="/chef/products">
            <Cookie size={20} />
            Products
          </Link>
          <a href="#chefs">
            <Users size={20} />
            Chefs
          </a>
          <a href="#settings">
            <Settings size={20} />
            Settings
          </a>
        </nav>

        <div className="admin-profile">
          <div className="admin-profile-avatar">
            <ChefHat size={22} />
          </div>
          <div>
            <strong>{session.name}</strong>
            <span>Protected Admin</span>
          </div>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-mobile-brand">
            <button type="button" aria-label="Open admin menu">
              <PanelLeft size={22} />
            </button>
            <span>Lula&apos;s Admin</span>
          </div>

          <label className="admin-search">
            <Search size={18} />
            <input type="search" placeholder="Search orders, products..." />
          </label>

          <div className="admin-topbar-actions">
            <button type="button" className="admin-icon-button" aria-label="Notifications">
              <Bell size={20} />
              {pendingOrders > 0 && <span aria-label={`${pendingOrders} pending orders`} />}
            </button>
            <div className="admin-divider" />
            <Link href="/" className="admin-account-link">
              <span>Lula&apos;s Pastry</span>
              <CircleUserRound size={22} />
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="admin-icon-button" aria-label="Logout">
                <LogOut size={19} />
              </button>
            </form>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-title">
            <div>
              <p>Protected admin area</p>
              <h2>Dashboard</h2>
            </div>
            <div className="admin-title-actions">
              <Link href="/chef/products" className="admin-secondary-button">
                <Store size={18} />
                Manage Products
              </Link>
              <Link href="/chef/dashboard" className="admin-primary-button">
                <ClipboardList size={18} />
                Chef Orders View
              </Link>
            </div>
          </div>

          <section className="admin-stat-grid" aria-label="Admin summary">
            <article className="admin-stat-card">
              <div>
                <span>Today&apos;s Sales</span>
                <CreditCard size={24} />
              </div>
              <strong>{money(todaysSales)}</strong>
              <p>
                <TrendingUp size={16} />
                {todaysOrders.length} orders today
              </p>
            </article>

            <article className="admin-stat-card">
              <div>
                <span>Total Orders</span>
                <ReceiptText size={24} />
              </div>
              <strong>{orders.length}</strong>
              <p>
                <BadgeCheck size={16} />
                {completedToday} completed today
              </p>
            </article>

            <article className="admin-stat-card admin-top-product-card">
              <div>
                <span>Top Product</span>
                <Star size={24} />
              </div>
              <strong>{topSellingDish?.name ?? "No sales yet"}</strong>
              <p>{topSellingDish ? `${topSellingDish.unitsSold} units sold` : "Waiting for first order"}</p>
              <Cookie className="admin-card-watermark" size={92} />
            </article>
          </section>

          <section id="orders" className="admin-table-panel">
            <div className="admin-panel-heading">
              <h3>Recent Orders</h3>
              <Link href="/chef/dashboard">View All</Link>
            </div>

            <div className="admin-table-scroll">
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7}>No orders yet.</td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.order_number || `#${order.id}`}</td>
                        <td>{order.full_name ?? "Customer"}</td>
                        <td>{niceDate(order.order_date)}</td>
                        <td>{money(order.total_amount)}</td>
                        <td>
                          <span className={orderStatusClass(order.status)}>{statusLabel(order.status)}</span>
                        </td>
                        <td>
                          {order.status === "pending" ? (
                            <div className="admin-row-actions">
                              <form action={updateOrderStatusAction}>
                                <input type="hidden" name="order_id" value={order.id} />
                                <input type="hidden" name="status" value="confirmed" />
                                <button type="submit" className="admin-mini-button">
                                  <BadgeCheck size={15} />
                                  Confirm
                                </button>
                              </form>
                              <form action={updateOrderStatusAction}>
                                <input type="hidden" name="order_id" value={order.id} />
                                <input type="hidden" name="status" value="rejected" />
                                <button type="submit" className="admin-mini-button danger">
                                  <X size={15} />
                                  Reject
                                </button>
                              </form>
                            </div>
                          ) : (
                            <span className="admin-handled-label">Handled</span>
                          )}
                        </td>
                        <td>
                          <Link href={`/chef/orders/${order.id}`} className="admin-more-link" aria-label="Open order">
                            <MoreVertical size={20} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-table-footer">
              <p>
                Showing {recentOrders.length} of {orders.length} orders
              </p>
              <div>
                <button type="button" aria-label="Previous page">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" aria-label="Next page">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>

          <section className="admin-secondary-grid">
            <article className="admin-panel">
              <h3>Stock Alerts</h3>
              <div className="admin-alert-list">
                <div className="admin-alert-row danger">
                  <div>
                    <Package size={20} />
                    <span>
                      <strong>Madagascar Vanilla</strong>
                      <small>Only 200g remaining</small>
                    </span>
                  </div>
                  <button type="button">Reorder</button>
                </div>
                <div className="admin-alert-row warning">
                  <div>
                    <Package size={20} />
                    <span>
                      <strong>Bread Flour</strong>
                      <small>2 bags left</small>
                    </span>
                  </div>
                  <button type="button">Update</button>
                </div>
              </div>
            </article>

            <article id="settings" className="admin-production-card">
              <div>
                <h3>Bake Today?</h3>
                <p>Generate the morning production schedule based on current pre-orders.</p>
                <button type="button">
                  <Printer size={18} />
                  Print Schedule
                </button>
              </div>
              <Cookie size={180} />
            </article>
          </section>

          <section id="chefs" className="admin-chef-grid">
            <form action={createChefAction} className="admin-panel admin-chef-form">
              <h3>Add Chef</h3>
              {error && <div className="error">{error}</div>}
              {chefCreated && <div className="notice">Chef account created.</div>}
              <label>
                Full name
                <input name="full_name" placeholder="Chef full name" required />
              </label>
              <label>
                Username
                <input name="username" placeholder="chef_username" required />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="chef@lulaspastry.com" required />
              </label>
              <label>
                Phone
                <input name="phone" placeholder="+961..." />
              </label>
              <label>
                Temporary password
                <input name="password" type="password" placeholder="Set a temporary password" required />
              </label>
              <button type="submit" className="admin-primary-button">
                Create Chef
              </button>
            </form>

            <article className="admin-panel">
              <h3>Chef Team</h3>
              <div className="admin-team-list">
                {chefs.length === 0 ? (
                  <p>No chefs have been added yet.</p>
                ) : (
                  chefs.map((chef) => (
                    <div key={chef.id} className="admin-team-row">
                      <div>
                        <strong>{chef.full_name ?? chef.username}</strong>
                        <span>{chef.email}</span>
                      </div>
                      <ChefHat size={19} />
                    </div>
                  ))
                )}
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
