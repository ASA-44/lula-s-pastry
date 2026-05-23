import { Plus } from "lucide-react";

import { addToCartAction } from "@/app/actions";
import { imagePath, money } from "@/lib/format";
import type { Dish } from "@/types/database";

type ProductCardProps = {
  dish: Dish;
  canOrder?: boolean;
};

export function ProductCard({ dish, canOrder = false }: ProductCardProps) {
  return (
    <article className="product-card">
      <img src={imagePath(dish.image_url)} alt={dish.name} className="product-image" />
      <div className="product-content">
        <div>
          <p className="eyebrow">{dish.category ?? "Pastry"}</p>
          <h3>{dish.name}</h3>
          <p>{dish.description ?? "Freshly prepared by Lula's pastry kitchen."}</p>
        </div>
        <div className="product-footer">
          <strong>{money(dish.price)}</strong>
          {canOrder && (
            <form action={addToCartAction} className="inline-form">
              <input type="hidden" name="dish_id" value={dish.id} />
              <input
                type="number"
                name="quantity"
                min="1"
                defaultValue="1"
                placeholder="1"
                className="quantity-input"
                aria-label={`Quantity for ${dish.name}`}
              />
              <button className="icon-button" type="submit">
                <Plus size={18} />
                Add
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}
