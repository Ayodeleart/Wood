import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabasePublic";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductGallery from "@/components/ProductGallery";
import BuyButton from "@/components/BuyButton";
import AddToCartButton from "@/components/ecommerce/AddToCartButton";
import EnquireLink from "@/components/EnquireLink";
import FavoriteButton from "@/components/ecommerce/FavoriteButton";
import ShopShell from "@/components/ecommerce/ShopShell";
import { Star } from "lucide-react";

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
    <ShopShell hideNav className="pb-28 md:pb-16 pt-6">
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
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display font-semibold text-shop-text text-[clamp(28px,5vw,48px)] leading-[0.95]">
                {product.name}
              </h1>
              <FavoriteButton productId={product.id} className="shrink-0" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <p className="text-shop-mute text-lg">
                {product.price ? `₦${Number(product.price).toLocaleString()}` : "Price on request"}
              </p>
              {product.rating && (
                <span className="flex items-center gap-1 text-sm text-shop-mute">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {Number(product.rating).toFixed(1)}
                </span>
              )}
            </div>
            {product.description && (
              <p className="mt-6 text-shop-text/70 leading-relaxed max-w-md">{product.description}</p>
            )}
            <div className="hidden md:flex items-center gap-3 flex-wrap">
              <EnquireLink productId={product.id} />
              <AddToCartButton product={product} image={images[0]} />
              <BuyButton productId={product.id} price={product.price} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile price + add-to-cart bar — bottom nav is hidden on this page, so this owns the bottom */}
      {product.price && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-shop-bg border-t border-shop-line px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] flex items-center justify-between gap-4">
          <span className="text-shop-text text-lg font-medium shrink-0">₦{Number(product.price).toLocaleString()}</span>
          <div className="flex-1 max-w-[220px]">
            <AddToCartButton product={product} image={images[0]} fullWidth />
          </div>
        </div>
      )}
    </ShopShell>
  );
}
