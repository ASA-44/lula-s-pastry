import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Ban,
  Download,
  MoreVertical,
  Package,
  Pencil,
  PlusCircle,
  Trash2
} from "lucide-react";

import { deleteDishAction } from "@/app/actions";
import { AdminNavigation } from "@/components/AdminNavigation";
import { Button } from "@/components/Button";
import { getAllDishes } from "@/lib/data";
import { imagePath, money } from "@/lib/format";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function categoryLabel(category: string | null | undefined) {
  return category ? category.replace(/[-_]/g, " ") : "pastry";
}

export default async function AdminProductsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }

  const dishes = await getAllDishes();
  const categories = Array.from(new Set(dishes.map((dish) => categoryLabel(dish.category)))).slice(0, 5);
  const outOfStockCount = dishes.filter((dish) => !dish.available).length;

  return (
    <main className="admin-dashboard-shell">
      <section className="admin-main">
        <AdminNavigation
          active="products"
          notificationCount={outOfStockCount}
          searchPlaceholder="Search products..."
          session={session}
        />

        <div className="admin-content admin-products-content">
          <div className="admin-products-title">
            <div>
              <h2>Product Inventory</h2>
              <p>
                Manage your artisanal collection of handcrafted pastries and signature cakes. Keep the daily
                menu polished, available, and ready for customer orders.
              </p>
            </div>
            <Button href="/chef/products/new">
              <PlusCircle size={19} />
              Add New Product
            </Button>
          </div>

          <div className="admin-filter-chips" aria-label="Product categories">
            <Button type="button" variant="chipActive">
              All Pastries
            </Button>
            {categories.map((category) => (
              <Button key={category} type="button" variant="chip">
                {category}
              </Button>
            ))}
          </div>

          {dishes.length === 0 ? (
            <div className="admin-empty-products">No dishes found.</div>
          ) : (
            <section className="admin-product-grid" aria-label="Product inventory cards">
              {dishes.map((dish) => {
                const isAvailable = Boolean(dish.available);

                return (
                  <article key={dish.id} className={isAvailable ? "admin-product-card" : "admin-product-card out"}>
                    <div className="admin-product-image">
                      <img src={imagePath(dish.image_url)} alt={dish.name} />
                      {isAvailable ? (
                        <span className="admin-product-badge in">In Stock</span>
                      ) : (
                        <div className="admin-product-sold-out">
                          <span>Out of Stock</span>
                        </div>
                      )}
                    </div>

                    <div className="admin-product-body">
                      <div className="admin-product-heading">
                        <h3>{dish.name}</h3>
                        <strong>{money(dish.price)}</strong>
                      </div>
                      <p className="admin-product-category">{categoryLabel(dish.category)}</p>
                      <p className="admin-product-description">
                        {dish.description ?? "Handcrafted Lula's Pastry menu item."}
                      </p>

                      <div className="admin-product-footer">
                        <div className={isAvailable ? "admin-product-stock" : "admin-product-stock danger"}>
                          {isAvailable ? <Package size={16} /> : <Ban size={16} />}
                          <span>{isAvailable ? "Available for orders" : "Sold out"}</span>
                        </div>
                        <div className="admin-product-actions">
                          <Button type="button" variant="productIcon" aria-label={`Edit ${dish.name}`} disabled>
                            <Pencil size={18} />
                          </Button>
                          <form action={deleteDishAction}>
                            <input type="hidden" name="dish_id" value={dish.id} />
                            <Button
                              type="submit"
                              variant="productIcon"
                              className="danger"
                              aria-label={`Delete ${dish.name}`}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          <section className="admin-stock-section">
            <div className="admin-stock-heading">
              <h3>Quick Stock Analysis</h3>
              <Button type="button" variant="text">
                Download Full Report
                <Download size={16} />
              </Button>
            </div>

            <div className="admin-stock-table-panel">
              <div className="admin-table-scroll">
                <table className="admin-stock-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock Status</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dishes.map((dish) => {
                      const isAvailable = Boolean(dish.available);

                      return (
                        <tr key={dish.id}>
                          <td>
                            <div className="admin-stock-product">
                              <img src={imagePath(dish.image_url)} alt="" />
                              <strong>{dish.name}</strong>
                            </div>
                          </td>
                          <td>{categoryLabel(dish.category)}</td>
                          <td>
                            <span className={isAvailable ? "admin-stock-pill" : "admin-stock-pill danger"}>
                              {isAvailable ? <Package size={14} /> : <AlertTriangle size={14} />}
                              {isAvailable ? "In stock" : "Out of stock"}
                            </span>
                          </td>
                          <td>
                            <strong>{money(dish.price)}</strong>
                          </td>
                          <td>
                            <Button type="button" variant="moreIcon" aria-label={`Open actions for ${dish.name}`}>
                              <MoreVertical size={20} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
