import "./globals.css";
import { Suspense } from "react";
import RegisterSW from "@/components/RegisterSW";
import IntroSplash from "@/components/ecommerce/IntroSplash";
import NotificationPrompt from "@/components/ecommerce/NotificationPrompt";
import InstallPromptGate from "@/components/ecommerce/InstallPromptGate";
import { ShopThemeProvider } from "@/lib/ShopThemeContext";
import { supabasePublic } from "@/lib/supabasePublic";
import { cookies } from "next/headers";

export const metadata = {
  title: "Ola Wood — Furniture · Interior · Living",
  description: "Italian-inspired furniture, made real. Sofas, bed frames, TV consoles, kitchen cabinets and more.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const initialTheme = cookieStore.get("shopTheme")?.value === "dark" ? "dark" : "light";

  const { data: introSlides } = await supabasePublic
    .from("shop_hero_slides")
    .select("*")
    .eq("placement", "intro")
    .order("sort_order", { ascending: true });

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ShopThemeProvider initialTheme={initialTheme}>
          {children}
          <IntroSplash slides={introSlides || []} />
          <NotificationPrompt />
          <Suspense fallback={null}>
            <InstallPromptGate />
          </Suspense>
        </ShopThemeProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
