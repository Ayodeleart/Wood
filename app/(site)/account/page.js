import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import SignOutButton from "@/components/ecommerce/SignOutButton";
import { Heart, ShoppingBag, ChevronRight } from "lucide-react";

export default async function AccountPage() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();

  if (!user) redirect("/account/login?next=/account");

  const name = user.user_metadata?.full_name || user.email?.split("@")[0];

  return (
    <main className="shop-dark min-h-screen pt-24 pb-24 px-4">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-shop-tile flex items-center justify-center text-shop-bg text-2xl font-medium shrink-0">
          {name?.[0]?.toUpperCase() || "?"}
        </div>
        <div>
          <h1 className="font-display text-2xl text-shop-text">{name}</h1>
          <p className="text-shop-mute text-sm">{user.email}</p>
        </div>
      </div>

      <div className="border-t border-shop-line">
        {[
          { href: "/account/saved", icon: Heart, label: "Saved Items" },
          { href: "/cart", icon: ShoppingBag, label: "Cart" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between py-4 border-b border-shop-line text-shop-text"
          >
            <span className="flex items-center gap-3">
              <item.icon size={18} strokeWidth={1.6} className="text-shop-mute" />
              {item.label}
            </span>
            <ChevronRight size={16} className="text-shop-mute" />
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <SignOutButton />
      </div>
    </main>
  );
}
