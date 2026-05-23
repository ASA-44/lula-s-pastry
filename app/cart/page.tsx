import Link from "next/link";
import { redirect } from "next/navigation";
import { Trash2 } from "lucide-react";

import { removeCartItemAction, updateCartItemAction } from "@/app/actions";
import { SiteHeader } from "@/components/SiteHeader";
import { getCartItems } from "@/lib/data";
import { imagePath, money } from "@/lib/format";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    redirect("/login");
  }

  const cartItems = await getCartItems(session.id);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="section">
        <div className="page-title">
          <div>
            <p className="eyebrow">Customer cart</p>
            <h1>Your Cart</h1>
            <p>Update quantities or continue to checkout.</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            Your cart is empty. <Link href="/products">Browse the menu</Link>.
          </div>
        ) : (
          <div className="cart-layout">
            <div className="detail-panel">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.cart_id}>
                  <img src={imagePath(item.image_url)} alt={item.name} />
                  <div>
                    <p className="eyebrow">{money(item.price)} each</p>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="cart-actions">
                      <form action={updateCartItemAction} className="inline-form">
                        <input type="hidden" name="cart_id" value={item.cart_id} />
                        <input
                          className="quantity-input"
                          type="number"
                          name="quantity"
                          min="0"
                          defaultValue={item.quantity}
                          aria-label={`Quantity for ${item.name}`}
                        />
                        <button className="ghost-button small" type="submit">
                          Update
                        </button>
                      </form>
                      <form action={removeCartItemAction}>
                        <input type="hidden" name="cart_id" value={item.cart_id} />
                        <button className="danger-button small" type="submit">
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="summary-panel">
              <div className="summary-lines">
                <div>
                  <span>Subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>{money(4)}</strong>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <strong>{money(subtotal + 4)}</strong>
                </div>
              </div>
              <Link href="/checkout" className="primary-button" style={{ width: "100%", marginTop: 18 }}>
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
