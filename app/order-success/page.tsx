import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const session = await getSession();
  const params = (await searchParams) ?? {};
  const orderId = pick(params.orderId);

  return (
    <main className="page-shell">
      <SiteHeader session={session} />

      <section className="auth-wrap">
        <div className="auth-card form-stack" style={{ textAlign: "center" }}>
          <CheckCircle2 size={66} color="#266431" style={{ margin: "0 auto" }} />
          <h2>Order Placed Successfully</h2>
          <p>Your order was saved in the database and sent to the chef dashboard.</p>
          {orderId && <div className="notice">Order ID: {orderId}</div>}
          <Link href="/products" className="primary-button">
            Back to Menu
          </Link>
        </div>
      </section>
    </main>
  );
}
