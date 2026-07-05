import ShopBottomNav from "@/components/ecommerce/ShopBottomNav";

// Every shop-scoped page should wrap its content in this, instead of each
// page remembering to add the bottom nav and theme class itself — that's
// exactly what went wrong (saved/cart/account/product pages all shipped
// without the bottom nav because each page had to remember it separately).
export default function ShopShell({ children, className = "" }) {
  return (
    <div className="shop-light min-h-screen">
      <div className={`pb-24 md:pb-0 ${className}`}>{children}</div>
      <ShopBottomNav />
    </div>
  );
}
