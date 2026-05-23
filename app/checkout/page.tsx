import { redirect } from "next/navigation";

import { checkoutAction } from "@/app/actions";
import { SiteHeader } from "@/components/SiteHeader";
import { getCartItems } from "@/lib/data";
import { money } from "@/lib/format";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    redirect("/login");
  }

  const cartItems = await getCartItems(session.id);
  if (cartItems.length === 0) {
    redirect("/products");
  }

  const params = (await searchParams) ?? {};
  const error = pick(params.error);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="section">
        <div className="page-title">
          <div>
            <p className="eyebrow">Final step</p>
            <h1>Checkout</h1>
            <p>Confirm delivery details and payment method.</p>
          </div>
        </div>

        <div className="checkout-layout">
          <form action={checkoutAction} className="auth-card form-stack">
            {error && <div className="error">{error}</div>}
            <div className="form-row">
              <label htmlFor="delivery_date">Delivery date</label>
              <input
                id="delivery_date"
                name="delivery_date"
                type="date"
                placeholder="Choose a delivery date"
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="address">Delivery address</label>
              <input id="address" name="address" placeholder="Enter your full delivery address" required />
            </div>
            <div className="form-row">
              <label htmlFor="phone">Phone number</label>
              <input id="phone" name="phone" placeholder="+961 76 123 404" required />
            </div>
            <div className="form-row">
              <label htmlFor="payment_method">Payment method</label>
              <select id="payment_method" name="payment_method" required>
                <option value="">Select payment</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="instructions">Special instructions</label>
              <textarea id="instructions" name="instructions" placeholder="Add notes such as extra nuts or delivery timing" />
            </div>
            <button className="primary-button" type="submit">
              Place Order
            </button>
          </form>

          <aside className="summary-panel">
            <h3>Order Summary</h3>
            <div className="summary-lines">
              {cartItems.map((item) => (
                <div key={item.cart_id}>
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
              ))}
              <div>
                <span>Delivery</span>
                <strong>{money(4)}</strong>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong>{money(subtotal + 4)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
