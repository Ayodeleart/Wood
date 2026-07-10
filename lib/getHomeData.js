import { supabasePublic } from "@/lib/supabasePublic";

export async function getHomeData() {
  const { data: categories } = await supabasePublic
    .from("categories")
    .select("*, category_images(url, sort_order)")
    .order("sort_order");

  if (!categories?.length) return { categories: [], allCategories: [], featuredProducts: [] };

  const results = await Promise.all(
    categories.map(async (cat) => {
      const { data: products } = await supabasePublic
        .from("products")
        .select("id, slug, name, price, rating, night_image_url, product_images(url, sort_order)")
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

      // Tile slideshow frames: curated category photos first, then fill in with
      // actual product photos so a category with several items doesn't sit on
      // one static image — capped at 4 so the crossfade stays quick and light.
      const productImages = normalized.map((p) => p.image).filter(Boolean);
      const tileFrames = [...new Set([...heroImages, ...productImages])].slice(0, 4);

      return {
        slug: cat.slug,
        name: cat.name,
        tagline: cat.tagline,
        // Multiple uploaded hero photos win; otherwise fall back to the first product's photo.
        heroImages: heroImages.length ? heroImages : normalized[0]?.image ? [normalized[0].image] : [],
        tileFrames: tileFrames.length ? tileFrames : normalized[0]?.image ? [normalized[0].image] : [],
        products: normalized,
      };
    })
  );

  // Only show categories WITH products in the homepage product rails...
  const withProducts = results.filter((c) => c.products.length > 0);

  // ...but keep every category (even ones with 0 products, like a freshly added
  // "Curtains" with nothing uploaded yet) for things like the category icon row,
  // where disappearing entirely would look like a missing/broken category rather
  // than "no products yet."
  const allCategories = results.map((c) => ({ slug: c.slug, name: c.name, tagline: c.tagline }));

  // Desktop-only "Featured Products" strip — top viewed products across all categories,
  // falling back to most recent if nothing has views yet.
  const { data: featuredRaw } = await supabasePublic
    .from("products")
    .select("id, slug, name, price, rating, view_count, night_image_url, categories(name), product_images(url, sort_order)")
    .order("view_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(4);

  const featuredProducts = (featuredRaw || []).map((p) => {
    const images = (p.product_images || []).sort((a, b) => a.sort_order - b.sort_order);
    return { ...p, image: images[0]?.url || null, categoryName: p.categories?.name || "" };
  });

  return { categories: withProducts, allCategories, featuredProducts };
}
