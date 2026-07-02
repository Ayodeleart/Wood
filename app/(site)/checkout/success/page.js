"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [state, setState] = useState({ loading: true, paid: false, order: null, error: "" });

  useEffect(() => {
    if (!reference) {
      setState({ loading: false, paid: false, order: null, error: "No payment reference found." });
      return;
    }
    fetch(`/api/checkout/verify?reference=${reference}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setState({ loading: false, paid: false, order: null, error: data.error });
        } else {
          setState({ loading: false, paid: data.paid, order: data.order, error: "" });
        }
      })
      .catch(() => setState({ loading: false, paid: false, order: null, error: "Could not verify payment." }));
  }, [reference]);

  return (
    <main className="flex-1 min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        {state.loading && <p className="text-mute">Confirming your payment…</p>}

        {!state.loading && state.paid && (
          <>
            <h1 className="font-display text-3xl text-ink mb-3">Payment Received</h1>
            <p className="text-mute mb-1">
              Thank you, {state.order?.customer_name?.split(" ")[0]} — your order for{" "}
              <span className="text-ink">{state.order?.product_name}</span> has been confirmed.
            </p>
            <p className="text-mute mb-8">
              ₦{Number(state.order?.amount).toLocaleString()} · Ref: {state.order?.reference}
            </p>
            <p className="text-sm text-mute mb-8">
              We'll reach out shortly on WhatsApp/call to arrange delivery details.
            </p>
            <Link href="/" className="label border-b border-ink/30 pb-2 hover:border-ink transition-colors">
              Back to shop
            </Link>
          </>
        )}

        {!state.loading && !state.paid && !state.error && (
          <>
            <h1 className="font-display text-3xl text-ink mb-3">Payment Not Confirmed</h1>
            <p className="text-mute mb-8">
              We couldn't confirm this payment. If you were charged, please contact us with reference{" "}
              {reference}.
            </p>
            <Link href="/" className="label border-b border-ink/30 pb-2 hover:border-ink transition-colors">
              Back to shop
            </Link>
          </>
        )}

        {state.error && <p className="text-red-500">{state.error}</p>}
      </div>
    </main>
  );
}
