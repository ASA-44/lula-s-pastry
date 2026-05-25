import { BadgeCheck, ChevronLeft, ChevronRight, MoreVertical, X } from "lucide-react";

import { updateOrderStatusAction } from "@/app/actions";
import { Button } from "@/components/Button";
import { money, niceDate } from "@/lib/format";
import type { Order, OrderStatus } from "@/types/database";

type AdminOrdersSectionProps = {
  orders: Order[];
};

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

export function AdminOrdersSection({ orders }: AdminOrdersSectionProps) {
  return (
    <div className="admin-content">
      <div className="admin-page-title">
        <div>
          <p>Admin orders</p>
          <h2>Orders</h2>
        </div>
      </div>

      <section className="admin-table-panel">
        <div className="admin-panel-heading">
          <h3>All Orders</h3>
          <Button href="/chef/dashboard" variant="text">
            Chef Orders View
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7}>No orders yet.</td>
                </tr>
              ) : (
                orders.map((order) => (
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
          <p>Showing {orders.length} orders</p>
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
    </div>
  );
}
