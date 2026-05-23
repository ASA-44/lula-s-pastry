import Link from "next/link";
import { redirect } from "next/navigation";

import { createDishAction } from "@/app/actions";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewDishPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || !["admin", "chef"].includes(session.role)) {
    redirect("/login");
  }

  const params = (await searchParams) ?? {};
  const error = pick(params.error);

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="auth-wrap">
        <div className="auth-copy">
          <p className="eyebrow">New dish</p>
          <h1>Add a pastry to the menu.</h1>
          <p>Upload a photo and save the dish directly into the MySQL database.</p>
          <Link href="/chef/products" className="ghost-button">
            Back to Products
          </Link>
        </div>

        <form action={createDishAction} className="auth-card form-stack">
          <h2>Dish Details</h2>
          {error && <div className="error">{error}</div>}
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" required />
          </div>
          <div className="form-row">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" />
          </div>
          <div className="form-row">
            <label htmlFor="price">Price</label>
            <input id="price" name="price" type="number" min="0.01" step="0.01" required />
          </div>
          <div className="form-row">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue="pastry">
              <option value="pastry">Pastry</option>
              <option value="cake">Cake</option>
              <option value="pie">Pie</option>
              <option value="muffin">Muffin</option>
              <option value="bread">Bread</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="ingredients">Ingredients</label>
            <textarea id="ingredients" name="ingredients" />
          </div>
          <div className="form-row">
            <label htmlFor="preparation_time">Preparation time in minutes</label>
            <input id="preparation_time" name="preparation_time" type="number" min="0" />
          </div>
          <div className="form-row">
            <label htmlFor="photo">Photo</label>
            <input id="photo" name="photo" type="file" accept="image/*" />
          </div>
          <button className="primary-button" type="submit">
            Save Dish
          </button>
        </form>
      </section>
    </main>
  );
}
