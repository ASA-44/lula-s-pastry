import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { getOrderDetails } from "@/lib/data";
import { money, niceDate, statusClass } from "@/lib/format";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChefOrderDetailsPage({ params }: PageProps) {
  const session = await getSession();
  if (!session || !["admin", "chef"].includes(session.role)) {
    redirect("/login");
  }

  const { id } = await params;
  const orderId = Number(id);
  const details = await getOrderDetails(orderId);

  if (!details) {
    notFound();
  }

  const { order, items } = details;

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="dashboard">
        <div className="dashboard-top">
          <div>
            <p className="eyebrow">Order details</p>
            <h1>{order.order_number || `Order #${order.id}`}</h1>
          </div>
          <Link href="/chef/dashboard" className="ghost-button">
            Back to Orders
          </Link>
        </div>

        <div className="detail-layout">
          <div className="detail-panel">
            <h2>Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{money(item.price_at_time)}</td>
                    <td>{money(item.price_at_time * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="summary-panel">
            <h3>Customer</h3>
            <div className="summary-lines">
              <div>
                <span>Name</span>
                <strong>{order.full_name ?? "Customer"}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{order.customer_phone ?? "Not set"}</strong>
              </div>
              <div>
                <span>Date</span>
                <strong>{niceDate(order.delivery_date)}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong className={statusClass(order.status)}>{order.status}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{money(order.total_amount)}</strong>
              </div>
            </div>
            <p>{order.delivery_address}</p>
            <p>{order.special_instructions}</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
