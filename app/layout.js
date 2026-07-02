import "./globals.css";

export const metadata = {
  title: "Ola Wood — Furniture · Interior · Living",
  description: "Italian-inspired furniture, made real. Sofas, bed frames, TV consoles, kitchen cabinets and more.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
