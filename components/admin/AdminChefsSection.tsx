import { ChefHat } from "lucide-react";

import { createChefAction } from "@/app/actions";
import { Button } from "@/components/Button";
import type { User } from "@/types/database";

type AdminChefsSectionProps = {
  chefCreated?: string;
  chefs: User[];
  error?: string;
};

export function AdminChefsSection({ chefCreated, chefs, error }: AdminChefsSectionProps) {
  return (
    <div className="admin-content">
      <div className="admin-page-title">
        <div>
          <p>Admin chefs</p>
          <h2>Chefs</h2>
        </div>
      </div>

      <section className="admin-chef-grid">
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
          <Button type="submit">Create Chef</Button>
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
  );
}
