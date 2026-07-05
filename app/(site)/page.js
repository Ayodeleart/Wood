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
import ShopBottomNav from "@/components/ecommerce/ShopBottomNav";
import HomeGate from "@/components/HomeGate";
import { getHomeData } from "@/lib/getHomeData";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabasePublic } from "@/lib/supabasePublic";
import Link from "next/link";

export const revalidate = 0;

export default async function Home({ searchParams }) {
  const { categories, featuredProducts } = await getHomeData();
  const params = await searchParams;
  const forcePreview = params?.preview === "shop";

  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();

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
      {featuredProducts?.length > 0 && (
        <div className="flex flex-col items-center text-center px-6 py-16 border-t border-line">
          <span className="label text-mute mb-3">The Full Collection</span>
          <h3 className="font-display text-2xl md:text-3xl text-ink mb-6">
            Sign in to browse and shop everything we have in the showroom.
          </h3>
          <Link
            href="/account/login"
            className="label border-b border-accent text-accent pb-1 hover:border-ink hover:text-ink transition-colors"
          >
            Sign In to Shop →
          </Link>
        </div>
      )}
      <Services />
      <WhyChooseUs />
      <Footer categories={categories} />
      <MobileCTABar />
    </main>
  );

  const ecommerce = (
    <main className="flex-1 shop-dark min-h-screen pb-24 md:pb-0">
      <ShopHero slides={shopSlides} />
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
          <span className="label text-shop-mute mb-3">Collection Coming</span>
          <h2 className="font-display text-3xl text-shop-text">Add your first product from the admin panel.</h2>
        </div>
      ) : (
        <>
          <CategoryStickyNav categories={categories} />
          {categories.map((cat) => (
            <ShopProductGrid key={cat.slug} category={cat} products={cat.products} />
          ))}
        </>
      )}
      <FeaturedProducts products={featuredProducts} dark />
      <ShopBottomNav />
    </main>
  );

  return <HomeGate loggedIn={!!user} forcePreview={forcePreview} landing={landing} ecommerce={ecommerce} />;
}
