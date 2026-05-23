import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, X } from "lucide-react";

import { createChefAction, updateOrderStatusAction } from "@/app/actions";
import { SiteHeader } from "@/components/SiteHeader";
import { getChefs, getOrders } from "@/lib/data";
import { money, niceDate, statusClass } from "@/lib/format";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const [orders, chefs] = await Promise.all([getOrders(), getChefs()]);
  const params = (await searchParams) ?? {};
  const error = pick(params.error);
  const chefCreated = pick(params.chefCreated);

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="dashboard">
        <div className="dashboard-top">
          <div>
            <p className="eyebrow">Protected admin area</p>
            <h1>Lula Admin Dashboard</h1>
          </div>
          <div className="inline-form">
            <Link href="/chef/products" className="ghost-button">
              Manage Products
            </Link>
            <Link href="/chef/dashboard" className="primary-button">
              Chef Orders View
            </Link>
          </div>
        </div>

        <div className="admin-layout">
          <div className="table-panel">
            <h2>Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No orders yet.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.order_number || `#${order.id}`}</td>
                      <td>{order.full_name ?? "Customer"}</td>
                      <td>{money(order.total_amount)}</td>
                      <td>
                        <span className={statusClass(order.status)}>{order.status}</span>
                      </td>
                      <td>{niceDate(order.order_date)}</td>
                      <td>
                        <Link href={`/chef/orders/${order.id}`} className="ghost-button small">
                          Open
                        </Link>
                      </td>
                      <td>
                        {order.status === "pending" ? (
                          <div className="inline-form">
                            <form action={updateOrderStatusAction}>
                              <input type="hidden" name="order_id" value={order.id} />
                              <input type="hidden" name="status" value="confirmed" />
                              <button className="icon-button small" type="submit">
                                <Check size={16} />
                                Confirm
                              </button>
                            </form>
                            <form action={updateOrderStatusAction}>
                              <input type="hidden" name="order_id" value={order.id} />
                              <input type="hidden" name="status" value="rejected" />
                              <button className="danger-button small" type="submit">
                                <X size={16} />
                                Reject
                              </button>
                            </form>
                          </div>
                        ) : (
                          <span className="eyebrow">Handled</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <aside className="admin-side">
            <form action={createChefAction} className="auth-card form-stack">
              <h2>Add Chef</h2>
              {error && <div className="error">{error}</div>}
              {chefCreated && <div className="notice">Chef account created.</div>}
              <div className="form-row">
                <label htmlFor="full_name">Full name</label>
                <input id="full_name" name="full_name" placeholder="Chef full name" required />
              </div>
              <div className="form-row">
                <label htmlFor="username">Username</label>
                <input id="username" name="username" placeholder="chef_username" required />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="chef@lulaspastry.com" required />
              </div>
              <div className="form-row">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" placeholder="+961..." />
              </div>
              <div className="form-row">
                <label htmlFor="password">Temporary password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Set a temporary password"
                  required
                />
              </div>
              <button className="primary-button" type="submit">
                Create Chef
              </button>
            </form>

            <div className="summary-panel">
              <h2>Chef Team</h2>
              <div className="team-list">
                {chefs.map((chef) => (
                  <div key={chef.id} className="team-row">
                    <strong>{chef.full_name ?? chef.username}</strong>
                    <span>{chef.email}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
