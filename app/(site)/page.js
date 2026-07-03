import Hero from "@/components/Hero";
import BrandStory from "@/components/BrandStory";
import CategoryTiles from "@/components/CategoryTiles";
import NeedsGrid from "@/components/NeedsGrid";
import CollectionRail from "@/components/CollectionRail";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import ShopHero from "@/components/ecommerce/ShopHero";
import CategoryStickyNav from "@/components/ecommerce/CategoryStickyNav";
import HomeGate from "@/components/HomeGate";
import { getHomeData } from "@/lib/getHomeData";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabasePublic } from "@/lib/supabasePublic";
import Link from "next/link";

export const revalidate = 0;

export default async function Home() {
  const { categories, heroFrames, featuredProducts } = await getHomeData();

  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();

  const { data: shopSlides } = await supabasePublic
    .from("shop_hero_slides")
    .select("*")
    .order("sort_order", { ascending: true });

  const landing = (
    <main className="flex-1">
      <Hero frames={heroFrames} />
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
    </main>
  );

  const ecommerce = (
    <main className="flex-1">
      <ShopHero slides={shopSlides || []} />
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
          <span className="label text-mute mb-3">Collection Coming</span>
          <h2 className="font-display text-3xl text-ink">Add your first product from the admin panel.</h2>
        </div>
      ) : (
        <>
          <CategoryStickyNav categories={categories} />
          {categories.map((cat) => <CollectionRail key={cat.slug} category={cat} products={cat.products} />)}
        </>
      )}
      <FeaturedProducts products={featuredProducts} />
    </main>
  );

  return <HomeGate loggedIn={!!user} landing={landing} ecommerce={ecommerce} />;
}
