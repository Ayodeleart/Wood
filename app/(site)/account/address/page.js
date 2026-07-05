import ShopShell from "@/components/ecommerce/ShopShell";

export default function AddressBookPage() {
  return (
    <ShopShell className="pt-24 pb-16 px-4">
      <h1 className="font-display text-2xl text-shop-text mb-6">Address Book</h1>
      <p className="text-shop-mute leading-relaxed max-w-md">
        Saved addresses aren't set up yet — for now, you'll enter your delivery address directly
        during checkout each time you order. We'll let you know when saved addresses are available.
      </p>
    </ShopShell>
  );
}
