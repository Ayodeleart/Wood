import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import SignOutButton from "@/components/ecommerce/SignOutButton";
import ShopShell from "@/components/ecommerce/ShopShell";
import {
  MapPin,
  Receipt,
  Globe,
  Bell,
  Phone,
  HelpCircle,
  Shield,
  FileText,
  ChevronRight,
  Pencil,
} from "lucide-react";

export const revalidate = 0;

export default async function AccountPage() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();

  if (!user) redirect("/account/login?next=/account");

  const name = user.user_metadata?.full_name || user.email?.split("@")[0];
  const avatarUrl = user.user_metadata?.avatar_url;

  const ACCOUNT_ROWS = [
    { href: "/account/address", icon: MapPin, label: "Address Book", sub: "Manage your delivery address" },
    { href: "/account/orders", icon: Receipt, label: "Order History", sub: "View your past orders" },
    { href: "/account/notifications", icon: Bell, label: "Notifications", sub: "Order and promo preferences" },
  ];

  const SUPPORT_ROWS = [
    { href: "mailto:olawoodworksynergy@gmail.com", icon: Phone, label: "Contact Us" },
    { href: "mailto:olawoodworksynergy@gmail.com", icon: HelpCircle, label: "Get Help" },
    { href: "/account/privacy", icon: Shield, label: "Privacy Policy" },
    { href: "/account/terms", icon: FileText, label: "Terms and Conditions" },
  ];

  return (
    <ShopShell className="pt-24 pb-16 px-4">
      <h1 className="font-display text-2xl text-shop-text mb-6">Profile</h1>

      <div className="flex items-center justify-between bg-shop-surface rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full bg-shop-tile overflow-hidden shrink-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-shop-bg text-xl font-medium">
                {name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div>
            <p className="text-shop-text font-medium">{name}</p>
            <p className="text-shop-mute text-sm">{user.email}</p>
          </div>
        </div>
        <Link
          href="/account/edit"
          aria-label="Edit profile"
          className="w-9 h-9 rounded-full bg-shop-bg border border-shop-line flex items-center justify-center shrink-0"
        >
          <Pencil size={14} className="text-shop-text" />
        </Link>
      </div>

      <div className="bg-shop-surface rounded-2xl overflow-hidden mb-6">
        {ACCOUNT_ROWS.map((row, i) => (
          <Link
            key={row.href}
            href={row.href}
            className={i > 0 ? "flex items-center justify-between px-4 py-4 border-t border-shop-line" : "flex items-center justify-between px-4 py-4"}
          >
            <span className="flex items-center gap-3">
              <row.icon size={18} strokeWidth={1.6} className="text-shop-mute" />
              <span>
                <span className="block text-shop-text text-sm">{row.label}</span>
                {row.sub && <span className="block text-shop-mute text-xs mt-0.5">{row.sub}</span>}
              </span>
            </span>
            <ChevronRight size={16} className="text-shop-mute" />
          </Link>
        ))}
        <div className="flex items-center justify-between px-4 py-4 border-t border-shop-line opacity-60">
          <span className="flex items-center gap-3">
            <Globe size={18} strokeWidth={1.6} className="text-shop-mute" />
            <span>
              <span className="block text-shop-text text-sm">Language</span>
              <span className="block text-shop-mute text-xs mt-0.5">English</span>
            </span>
          </span>
          <span className="text-shop-mute text-xs">More coming soon</span>
        </div>
      </div>

      <div className="bg-shop-surface rounded-2xl overflow-hidden mb-8">
        {SUPPORT_ROWS.map((row, i) => (
          <Link
            key={row.label}
            href={row.href}
            className={i > 0 ? "flex items-center justify-between px-4 py-4 border-t border-shop-line" : "flex items-center justify-between px-4 py-4"}
          >
            <span className="flex items-center gap-3">
              <row.icon size={18} strokeWidth={1.6} className="text-shop-mute" />
              <span className="text-shop-text text-sm">{row.label}</span>
            </span>
            <ChevronRight size={16} className="text-shop-mute" />
          </Link>
        ))}
      </div>

      <SignOutButton />
    </ShopShell>
  );
}
