import { Download, Filter, MoreVertical, TrendingUp, UserPlus } from "lucide-react";

import { Button } from "@/components/Button";
import { niceDate } from "@/lib/format";
import type { Order, User } from "@/types/database";

type AdminCustomersSectionProps = {
  customers: User[];
  orders: Order[];
};

type CustomerSummary = {
  customer: User;
  initials: string;
  lastOrder: Date | string | null;
  status: "VIP" | "Regular" | "New";
  totalOrders: number;
};

function initialsFor(customer: User) {
  const name = customer.full_name ?? customer.username;
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "CU";
}

function customerStatus(totalOrders: number): CustomerSummary["status"] {
  if (totalOrders >= 20) return "VIP";
  if (totalOrders >= 2) return "Regular";
  return "New";
}

function buildCustomerSummaries(customers: User[], orders: Order[]) {
  return customers.map((customer) => {
    const customerOrders = orders.filter((order) => order.user_id === customer.id);
    const lastOrder =
      customerOrders
        .map((order) => order.order_date)
        .filter(Boolean)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null;

    return {
      customer,
      initials: initialsFor(customer),
      lastOrder,
      status: customerStatus(customerOrders.length),
      totalOrders: customerOrders.length
    };
  });
}

export function AdminCustomersSection({ customers, orders }: AdminCustomersSectionProps) {
  const summaries = buildCustomerSummaries(customers, orders);
  const vipCount = summaries.filter((summary) => summary.status === "VIP").length;
  const retainedCount = summaries.filter((summary) => summary.totalOrders > 1).length;
  const retentionRate = summaries.length ? Math.round((retainedCount / summaries.length) * 1000) / 10 : 0;
  const spotlight = [...summaries].sort((a, b) => b.totalOrders - a.totalOrders)[0];
  const totalLoyaltyPoints = summaries.reduce((total, summary) => total + summary.totalOrders * 125, 0);

  return (
    <div className="admin-content admin-customers-page">
      <section className="admin-customers-hero">
        <div>
          <h2>Customers</h2>
          <p>Manage your artisanal community and loyalty programs.</p>
        </div>
        <div className="admin-customers-actions">
          <Button type="button" variant="secondary">
            <Download size={16} />
            Export List
          </Button>
          <Button type="button">
            <UserPlus size={16} />
            Add Customer
          </Button>
        </div>
      </section>

      <section className="admin-customer-stats" aria-label="Customer summary">
        <article>
          <span>Total Customers</span>
          <strong>{customers.length.toLocaleString()}</strong>
          <small>
            <TrendingUp size={13} />
            +12%
          </small>
        </article>
        <article>
          <span>VIP Members</span>
          <strong>{vipCount.toLocaleString()}</strong>
          <small>
            <TrendingUp size={13} />
            +5%
          </small>
        </article>
        <article>
          <span>Retention Rate</span>
          <strong>{retentionRate.toFixed(1)}%</strong>
          <small className="healthy">Healthy</small>
        </article>
      </section>

      <section className="admin-customers-table-card">
        <div className="admin-customer-tabs">
          <div>
            <button type="button" className="active">
              All
            </button>
            <button type="button">VIP</button>
            <button type="button">Regular</button>
            <button type="button">New</button>
          </div>
          <div>
            <Filter size={16} />
            <MoreVertical size={16} />
          </div>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-customers-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email Address</th>
                <th>Total Orders</th>
                <th>Status</th>
                <th>Last Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {summaries.length === 0 ? (
                <tr>
                  <td colSpan={6}>No customers have signed up yet.</td>
                </tr>
              ) : (
                summaries.map((summary) => (
                  <tr key={summary.customer.id}>
                    <td>
                      <div className="admin-customer-name-cell">
                        <span>{summary.initials}</span>
                        <strong>{summary.customer.full_name ?? summary.customer.username}</strong>
                      </div>
                    </td>
                    <td>{summary.customer.email}</td>
                    <td>
                      <strong>{summary.totalOrders}</strong>
                    </td>
                    <td>
                      <span className={`admin-customer-status ${summary.status.toLowerCase()}`}>
                        {summary.status}
                      </span>
                    </td>
                    <td>{summary.lastOrder ? niceDate(summary.lastOrder) : "Not yet"}</td>
                    <td>
                      <Button type="button" variant="moreIcon" aria-label={`Open ${summary.customer.email}`}>
                        <MoreVertical size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-customers-table-footer">
          <span>
            Showing {summaries.length ? 1 : 0}-{summaries.length} of {customers.length.toLocaleString()} customers
          </span>
          <div>
            <button type="button" aria-label="Previous customers page">
              {"<"}
            </button>
            <button type="button" className="active" aria-label="Customers page 1">
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
            <span>...</span>
            <button type="button">267</button>
            <button type="button" aria-label="Next customers page">
              {">"}
            </button>
          </div>
        </div>
      </section>

      <section className="admin-customers-lower-grid">
        <article className="admin-customer-spotlight">
          <div>
            <span>Customer Spotlight</span>
            <h3>{spotlight?.customer.full_name ?? spotlight?.customer.username ?? "No customer yet"}</h3>
            <p>
              {spotlight
                ? `Advanced "${spotlight.status}" customer with ${spotlight.totalOrders} total orders.`
                : "Customer highlights will appear here after signups."}
            </p>
            <Button type="button" variant="text">
              View Full History
            </Button>
          </div>
          <div className="admin-customer-portrait">
            {spotlight?.initials ?? "LP"}
          </div>
        </article>

        <article className="admin-loyalty-card">
          <h3>Loyalty Program Stats</h3>
          <dl>
            <div>
              <dt>New Signups this week</dt>
              <dd>{customers.length}</dd>
            </div>
            <div>
              <dt>VIP Conversion Rate</dt>
              <dd>{customers.length ? Math.round((vipCount / customers.length) * 1000) / 10 : 0}%</dd>
            </div>
            <div>
              <dt>Active Loyalty Points</dt>
              <dd>{totalLoyaltyPoints.toLocaleString()}</dd>
            </div>
          </dl>
          <Button type="button" variant="secondary">
            Manage Rewards
          </Button>
        </article>
      </section>
    </div>
  );
}
