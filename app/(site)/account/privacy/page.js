import ShopShell from "@/components/ecommerce/ShopShell";

export default function PrivacyPolicyPage() {
  return (
    <ShopShell className="pt-24 pb-16 px-4">
      <h1 className="font-display text-2xl text-shop-text mb-6">Privacy Policy</h1>
      <div className="text-shop-mute leading-relaxed max-w-md space-y-4 text-sm">
        <p>
          Olawood Work Synergy collects only what is needed to process your order and improve your
          experience: your name, email, phone number, and delivery address when you check out, and
          basic usage data (like which products you view) to help us stock what people actually want.
        </p>
        <p>
          We never sell your personal information to third parties. Payment details are handled
          directly by Paystack, we do not store your card information on our own servers at any point.
        </p>
        <p>
          You can request a copy of your data or ask us to delete your account at any time by
          contacting us at olawoodworksynergy@gmail.com
        </p>
      </div>
    </ShopShell>
  );
}
