import { Cookie, Package, Printer } from "lucide-react";

import { Button } from "@/components/Button";

export function AdminSettingsSection() {
  return (
    <div className="admin-content">
      <div className="admin-page-title">
        <div>
          <p>Admin settings</p>
          <h2>Settings</h2>
        </div>
      </div>

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

        <article className="admin-production-card">
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
    </div>
  );
}
