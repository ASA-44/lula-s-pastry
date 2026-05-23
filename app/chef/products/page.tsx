import Link from "next/link";
import { redirect } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteDishAction } from "@/app/actions";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllDishes } from "@/lib/data";
import { imagePath, money } from "@/lib/format";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ChefProductsPage() {
  const session = await getSession();
  if (!session || !["admin", "chef"].includes(session.role)) {
    redirect("/login");
  }

  const dishes = await getAllDishes();

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="dashboard">
        <div className="dashboard-top">
          <div>
            <p className="eyebrow">Chef products</p>
            <h1>Menu Management</h1>
          </div>
          <Link href="/chef/products/new" className="primary-button">
            Add Dish
          </Link>
        </div>

        <div className="table-panel">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Available</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dishes.length === 0 ? (
                <tr>
                  <td colSpan={6}>No dishes found.</td>
                </tr>
              ) : (
                dishes.map((dish) => (
                  <tr key={dish.id}>
                    <td>
                      <img className="admin-thumb" src={imagePath(dish.image_url)} alt={dish.name} />
                    </td>
                    <td>
                      <strong>{dish.name}</strong>
                      <p>{dish.description}</p>
                    </td>
                    <td>{dish.category ?? "pastry"}</td>
                    <td>{money(dish.price)}</td>
                    <td>{dish.available ? "Yes" : "No"}</td>
                    <td>
                      <form action={deleteDishAction}>
                        <input type="hidden" name="dish_id" value={dish.id} />
                        <button className="danger-button small" type="submit">
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </form>
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
