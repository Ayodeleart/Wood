import { supabasePublic } from "@/lib/supabasePublic";

export async function getHomeData() {
  const { data: categories } = await supabasePublic
    .from("categories")
    .select("*, category_images(url, sort_order)")
    .order("sort_order");

  if (!categories?.length) return { categories: [], heroFrames: [] };

  const results = await Promise.all(
    categories.map(async (cat) => {
      const { data: products } = await supabasePublic
        .from("products")
        .select("id, slug, name, price, night_image_url, product_images(url, sort_order)")
        .eq("category_id", cat.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(6);

      const normalized = (products || []).map((p) => {
        const images = (p.product_images || []).sort((a, b) => a.sort_order - b.sort_order);
        return { ...p, image: images[0]?.url || null };
      });

      const heroImages = (cat.category_images || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => i.url);

      return {
        slug: cat.slug,
        name: cat.name,
        tagline: cat.tagline,
        // Multiple uploaded hero photos win; otherwise fall back to the first product's photo.
        heroImages: heroImages.length ? heroImages : normalized[0]?.image ? [normalized[0].image] : [],
        products: normalized,
      };
    })
  );

  // Only show categories that actually have products on the storefront
  const withProducts = results.filter((c) => c.products.length > 0);

  // Flatten every category's hero photo(s) into one cycling list for the hero --
  // a category with 3 uploaded photos becomes 3 frames, not 1.
  const heroFrames = withProducts.flatMap((c) =>
    c.heroImages.map((image) => ({ slug: c.slug, name: c.name, tagline: c.tagline, image }))
  );

  // Desktop-only "Featured Products" strip — top viewed products across all categories,
  // falling back to most recent if nothing has views yet.
  const { data: featuredRaw } = await supabasePublic
    .from("products")
    .select("id, slug, name, price, view_count, night_image_url, categories(name), product_images(url, sort_order)")
    .order("view_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(4);

  const featuredProducts = (featuredRaw || []).map((p) => {
    const images = (p.product_images || []).sort((a, b) => a.sort_order - b.sort_order);
    return { ...p, image: images[0]?.url || null, categoryName: p.categories?.name || "" };
  });

  return { categories: withProducts, heroFrames, featuredProducts };
}
