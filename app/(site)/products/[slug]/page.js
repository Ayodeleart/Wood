import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabasePublic";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductGallery from "@/components/ProductGallery";
import BuyButton from "@/components/BuyButton";
import EnquireLink from "@/components/EnquireLink";

export const revalidate = 0;

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const { data: product } = await supabasePublic
    .from("products")
    .select("*, categories(name, slug), product_images(url, sort_order)")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  // Track the view server-side — no extra client round-trip needed.
  const sb = supabaseAdmin();
  await sb
    .from("products")
    .update({ view_count: (product.view_count || 0) + 1 })
    .eq("id", product.id);

  const images = (product.product_images || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);

  return (
    <main className="flex-1 shop-dark min-h-screen pb-28 md:pb-16 pt-24">
      <div className="px-4 md:px-14">
        <Link href={`/collections/${product.categories?.slug}`} className="label text-shop-mute hover:text-shop-text transition-colors">
          ← {product.categories?.name}
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-6">
          <ProductGallery
            images={images}
            name={product.name}
            nightImage={product.night_image_url}
            forceContain={product.categories?.slug === "sofas"}
          />

          <div className="flex flex-col pb-4">
            <h1 className="font-display font-semibold text-shop-text text-[clamp(28px,5vw,48px)] leading-[0.95]">
              {product.name}
            </h1>
            <p className="text-shop-mute mt-3 text-lg">
              {product.price ? `₦${Number(product.price).toLocaleString()}` : "Price on request"}
            </p>
            {product.description && (
              <p className="mt-6 text-shop-text/70 leading-relaxed max-w-md">{product.description}</p>
            )}
            <div className="hidden md:block">
              <EnquireLink productId={product.id} />
              <BuyButton productId={product.id} price={product.price} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile price + add-to-cart bar, matching the reference app pattern */}
      {product.price && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-shop-bg border-t border-shop-line px-4 py-4 flex items-center justify-between gap-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <span className="text-shop-text text-lg font-medium shrink-0">₦{Number(product.price).toLocaleString()}</span>
          <div className="flex-1 max-w-[220px]">
            <BuyButton productId={product.id} price={product.price} fullWidth />
          </div>
        </div>
      )}
    </main>
  );
}
