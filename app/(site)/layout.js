import Nav from "@/components/Nav";
import MobileCTABar from "@/components/MobileCTABar";
import { getNavCategories } from "@/lib/getNavCategories";
import { ThemeProvider } from "@/lib/ThemeContext";

export const revalidate = 0;

export default async function SiteLayout({ children }) {
  const categories = await getNavCategories();

  return (
    <ThemeProvider>
      <Nav categories={categories} />
      <div className="pb-16 md:pb-0">{children}</div>
      <MobileCTABar />
    </ThemeProvider>
  );
}
