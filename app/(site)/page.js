import Hero from "@/components/Hero";
import BrandStory from "@/components/BrandStory";
import CategoryTiles from "@/components/CategoryTiles";
import NeedsGrid from "@/components/NeedsGrid";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import MobileCTABar from "@/components/MobileCTABar";
import ShopHero from "@/components/ecommerce/ShopHero";
import CategoryStickyNav from "@/components/ecommerce/CategoryStickyNav";
import ShopProductGrid from "@/components/ecommerce/ShopProductGrid";
import CategoryIconRow from "@/components/ecommerce/CategoryIconRow";
import ShopShell from "@/components/ecommerce/ShopShell";
import HomeGate from "@/components/HomeGate";
import { getHomeData } from "@/lib/getHomeData";
import { supabasePublic } from "@/lib/supabasePublic";
import { headers } from "next/headers";

export const revalidate = 60;

export default async function Home({ searchParams }) {
  const { categories, allCategories, featuredProducts } = await getHomeData();
  const params = await searchParams;
  const forcePreview = params?.preview === "shop";

  // Middleware already verified the session for this request — read its
  // result instead of calling supabase.auth.getUser() again here.
  const h = await headers();
  const user = !!h.get("x-verified-user-id");

  const { data: allSlides } = await supabasePublic
    .from("shop_hero_slides")
    .select("*")
    .order("sort_order", { ascending: true });

  // Split by placement in JS rather than filtering in the query — this way the
  // page still works even before the placement/bg_color migration has been run
  // (older rows just have no `placement` value, and fall back to "shop" below,
  // which matches how the e-commerce hero already behaved).
  const landingSlides = (allSlides || []).filter((s) => s.placement === "landing");
  const shopSlides = (allSlides || []).filter((s) => !s.placement || s.placement === "shop");

  const landing = (
    <main className="flex-1">
      <Hero slides={landingSlides} />
      <BrandStory />
      <CategoryTiles categories={categories} />
      <NeedsGrid />
      <FeaturedProducts products={featuredProducts} />
      {categories.length > 0 && (
        <div className="shop-light border-t border-shop-line">
          <div className="flex flex-col items-center text-center px-6 pt-16 pb-8">
            <span className="label text-shop-mute mb-3">The Full Collection</span>
            <h3 className="font-display text-2xl md:text-3xl text-shop-text">Browse our full showroom</h3>
          </div>
          <CategoryStickyNav categories={categories} />
          {categories.map((cat, i) => (
            <ShopProductGrid key={cat.slug} category={cat} products={cat.products} priority={i === 0} />
          ))}
        </div>
      )}
      <Services />
      <WhyChooseUs />
      <Footer categories={categories} />
      <MobileCTABar />
    </main>
  );

  const ecommerce = (
    <ShopShell>
      <ShopHero slides={shopSlides} />
      <CategoryIconRow categories={allCategories} />
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
          <span className="label text-shop-mute mb-3">Collection Coming</span>
          <h2 className="font-display text-3xl text-shop-text">Add your first product from the admin panel.</h2>
        </div>
      ) : (
        <>
          <CategoryStickyNav categories={categories} />
          {categories.map((cat, i) => (
            <ShopProductGrid key={cat.slug} category={cat} products={cat.products} priority={i === 0} />
          ))}
        </>
      )}
      <FeaturedProducts products={featuredProducts} dark />
    </ShopShell>
  );

  return <HomeGate loggedIn={!!user} forcePreview={forcePreview} landing={landing} ecommerce={ecommerce} />;
}
