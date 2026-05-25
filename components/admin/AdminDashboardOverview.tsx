import { BadgeCheck, ClipboardList, Cookie, CreditCard, Settings, Star, Store, TrendingUp, Users } from "lucide-react";

import { Button } from "@/components/Button";
import { money } from "@/lib/format";
import type { Order } from "@/types/database";

type AdminDashboardOverviewProps = {
  orders: Order[];
  topSellingDish: {
    name: string;
    unitsSold: number;
  } | null;
};

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

export function AdminDashboardOverview({ orders, topSellingDish }: AdminDashboardOverviewProps) {
  const todaysOrders = orders.filter((order) => isToday(order.order_date));
  const todaysSales = todaysOrders.reduce((total, order) => total + order.total_amount, 0);
  const completedToday = todaysOrders.filter((order) =>
    ["confirmed", "ready", "delivered"].includes(order.status)
  ).length;

  return (
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
          <Button href="/admin/orders">
            <ClipboardList size={18} />
            View Orders
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
            <ClipboardList size={24} />
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

      <section className="admin-secondary-grid">
        <article className="admin-panel">
          <h3>Admin Parts</h3>
          <div className="admin-dashboard-links">
            <Button href="/admin/orders" variant="secondary">
              <ClipboardList size={18} />
              Orders
            </Button>
            <Button href="/admin/products" variant="secondary">
              <Store size={18} />
              Products
            </Button>
            <Button href="/admin/chefs" variant="secondary">
              <Users size={18} />
              Chefs
            </Button>
            <Button href="/admin/settings" variant="secondary">
              <Settings size={18} />
              Settings
            </Button>
          </div>
        </article>

        <article className="admin-production-card">
          <div>
            <h3>Ready to Manage?</h3>
            <p>Use the separated admin pages to handle orders, products, chefs, and settings without crowding one file.</p>
            <Button href="/admin/orders">
              <ClipboardList size={18} />
              Open Orders
            </Button>
          </div>
          <Cookie size={180} />
        </article>
      </section>
    </div>
  );
}
