import { Mail, MapPin, Phone, UsersRound } from "lucide-react";

import type { User } from "@/types/database";

type AdminCustomersSectionProps = {
  customers: User[];
};

export function AdminCustomersSection({ customers }: AdminCustomersSectionProps) {
  return (
    <div className="admin-content">
      <div className="admin-page-title">
        <div>
          <p>Admin customers</p>
          <h2>Customers</h2>
        </div>
      </div>

      <section className="admin-panel">
        <h3>Customer Accounts</h3>
        <div className="admin-customer-list">
          {customers.length === 0 ? (
            <p>No customers have signed up yet.</p>
          ) : (
            customers.map((customer) => (
              <article key={customer.id} className="admin-customer-row">
                <div className="admin-customer-avatar">
                  <UsersRound size={20} />
                </div>
                <div>
                  <strong>{customer.full_name ?? customer.username}</strong>
                  <span>
                    <Mail size={14} />
                    {customer.email}
                  </span>
                  {customer.phone && (
                    <span>
                      <Phone size={14} />
                      {customer.phone}
                    </span>
                  )}
                  {customer.address && (
                    <span>
                      <MapPin size={14} />
                      {customer.address}
                    </span>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
