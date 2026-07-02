import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabasePublic";
import CollectionGrid from "@/components/CollectionGrid";

export const revalidate = 0;

export default async function CollectionPage({ params }) {
  const { slug } = await params;

  const { data: category } = await supabasePublic
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  const { data: products } = await supabasePublic
    .from("products")
    .select("id, slug, name, price, night_image_url, product_images(url, sort_order)")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  const normalized = (products || []).map((p) => {
    const images = (p.product_images || []).sort((a, b) => a.sort_order - b.sort_order);
    return { ...p, image: images[0]?.url || null };
  });

  return (
    <main className="flex-1">
      <CollectionGrid category={category} products={normalized} forceContain={slug === "sofas"} />
    </main>
  );
}
