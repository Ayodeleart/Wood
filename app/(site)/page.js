import Hero from "@/components/Hero";
import BrandStory from "@/components/BrandStory";
import CategoryTiles from "@/components/CategoryTiles";
import NeedsGrid from "@/components/NeedsGrid";
import CollectionRail from "@/components/CollectionRail";
import WhyChooseUs from "@/components/WhyChooseUs";
import FeaturedProducts from "@/components/FeaturedProducts";
import ShopHero from "@/components/ecommerce/ShopHero";
import CategoryStickyNav from "@/components/ecommerce/CategoryStickyNav";
import HomeGate from "@/components/HomeGate";
import { getHomeData } from "@/lib/getHomeData";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabasePublic } from "@/lib/supabasePublic";

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
      <WhyChooseUs />
      <section id="contact" className="bg-ink text-paper py-28 px-6 md:px-14 text-center">
        <span className="label text-paper/60">Custom Orders · Consultations · Bespoke</span>
        <h2 className="font-display font-semibold text-[clamp(32px,6vw,64px)] mt-4 mb-10">Start a conversation</h2>
        <a
          href="mailto:olawoodworksynergy@gmail.com"
          className="label border-b border-paper/40 pb-2 hover:border-paper transition-colors"
        >
          olawoodworksynergy@gmail.com
        </a>
      </section>
      <footer className="py-10 px-6 md:px-14 text-center text-xs text-mute">
        <span>© {new Date().getFullYear()} Ola Wood — All Rights Reserved</span>
      </footer>
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
