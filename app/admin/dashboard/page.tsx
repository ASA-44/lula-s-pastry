import { redirect } from "next/navigation";
import {
  BadgeCheck,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cookie,
  CreditCard,
  MoreVertical,
  Package,
  Printer,
  ReceiptText,
  Star,
  Store,
  TrendingUp,
  X
} from "lucide-react";

import { createChefAction, updateOrderStatusAction } from "@/app/actions";
import { AdminSecretMessage } from "@/components/AdminSecretMessage";
import { AdminNavigation } from "@/components/AdminNavigation";
import { Button } from "@/components/Button";
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

      <section className="admin-main">
        <AdminNavigation
          active="dashboard"
          notificationCount={pendingOrders}
          searchPlaceholder="Search orders, products..."
          session={session}
        />

        <div className="admin-content">
          <div className="admin-page-title">
            <div>
              <p>Protected admin area</p>
              <h2>Dashboard</h2>
            </div>
            <div className="admin-title-actions">
              <Button href="/admin/products" variant="secondary">
                <Store size={18} />
                Manage Products
              </Button>
              <Button href="/chef/dashboard">
                <ClipboardList size={18} />
                Chef Orders View
              </Button>
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
              <Button href="/chef/dashboard" variant="text">
                View All
              </Button>
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
                                <Button type="submit" variant="mini">
                                  <BadgeCheck size={15} />
                                  Confirm
                                </Button>
                              </form>
                              <form action={updateOrderStatusAction}>
                                <input type="hidden" name="order_id" value={order.id} />
                                <input type="hidden" name="status" value="rejected" />
                                <Button type="submit" variant="dangerMini">
                                  <X size={15} />
                                  Reject
                                </Button>
                              </form>
                            </div>
                          ) : (
                            <span className="admin-handled-label">Handled</span>
                          )}
                        </td>
                        <td>
                          <Button href={`/chef/orders/${order.id}`} variant="moreIcon" aria-label="Open order">
                            <MoreVertical size={20} />
                          </Button>
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
                <Button type="button" variant="tableIcon" aria-label="Previous page">
                  <ChevronLeft size={18} />
                </Button>
                <Button type="button" variant="tableIcon" aria-label="Next page">
                  <ChevronRight size={18} />
                </Button>
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
                  <Button type="button" variant="alert">
                    Reorder
                  </Button>
                </div>
                <div className="admin-alert-row warning">
                  <div>
                    <Package size={20} />
                    <span>
                      <strong>Bread Flour</strong>
                      <small>2 bags left</small>
                    </span>
                  </div>
                  <Button type="button" variant="alert">
                    Update
                  </Button>
                </div>
              </div>
            </article>

            <article id="settings" className="admin-production-card">
              <div>
                <h3>Bake Today?</h3>
                <p>Generate the morning production schedule based on current pre-orders.</p>
                <Button type="button">
                  <Printer size={18} />
                  Print Schedule
                </Button>
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
              <Button type="submit">
                Create Chef
              </Button>
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
