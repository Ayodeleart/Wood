import Link from "next/link";
import Image from "next/image";
import { supabasePublic } from "@/lib/supabasePublic";
import ShopShell from "@/components/ecommerce/ShopShell";

export const revalidate = 0;

export default async function CategoriesPage() {
  const { data: categories } = await supabasePublic
    .from("categories")
    .select("slug, name, tagline, category_images(url, sort_order)")
    .order("sort_order");

  return (
    <ShopShell className="pt-6 pb-16 px-4">
      <h1 className="font-display text-2xl text-shop-text mb-6">All Categories</h1>

      {!categories || categories.length === 0 ? (
        <p className="text-shop-mute">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const imgs = cat.category_images || [];
            imgs.sort((a, b) => a.sort_order - b.sort_order);
            const img = imgs[0]?.url;
            return (
              <Link key={cat.slug} href={"/collections/" + cat.slug} className="flex flex-col active:scale-[0.97] transition-transform">
                <div className="relative aspect-square bg-shop-tile rounded-2xl overflow-hidden">
                  {img && <Image src={img} alt={cat.name} fill className="object-cover" />}
                </div>
                <span className="text-shop-text text-sm mt-2">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </ShopShell>
  );
}
