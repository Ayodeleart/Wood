import "./globals.css";
import RegisterSW from "@/components/RegisterSW";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
