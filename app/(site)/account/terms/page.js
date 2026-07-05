import ShopShell from "@/components/ecommerce/ShopShell";

export default function TermsPage() {
  return (
    <ShopShell className="pt-24 pb-16 px-4">
      <h1 className="font-display text-2xl text-shop-text mb-6">Terms and Conditions</h1>
      <div className="text-shop-mute leading-relaxed max-w-md space-y-4 text-sm">
        <p>
          Prices shown are in Nigerian Naira and are subject to change without notice until an order
          is confirmed. Once a payment is confirmed, we begin preparing your order for delivery.
        </p>
        <p>
          Delivery timelines vary by item and location, especially for made to order or custom
          pieces, we will confirm an estimated delivery window after your order is placed.
        </p>
        <p>
          If a piece arrives damaged or does not match its description, contact us within 48 hours of
          delivery so we can arrange a repair, replacement, or refund.
        </p>
        <p>
          By placing an order, you agree to provide accurate delivery and contact information so we
          can reach you regarding your order.
        </p>
      </div>
    </ShopShell>
  );
}
