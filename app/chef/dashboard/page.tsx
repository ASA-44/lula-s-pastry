import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, X } from "lucide-react";

import { updateOrderStatusAction } from "@/app/actions";
import { SiteHeader } from "@/components/SiteHeader";
import { getOrders } from "@/lib/data";
import { money, niceDate, statusClass } from "@/lib/format";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ChefDashboardPage() {
  const session = await getSession();
  if (!session || !["admin", "chef"].includes(session.role)) {
    redirect("/login");
  }

  const orders = await getOrders();

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="dashboard">
        <div className="dashboard-top">
          <div>
            <p className="eyebrow">Welcome Chef, {session.name}</p>
            <h1>Orders Dashboard</h1>
          </div>
          <Link href="/chef/products" className="primary-button">
            Manage Products
          </Link>
        </div>

        <div className="table-panel">
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
      </section>
    </main>
  );
}
