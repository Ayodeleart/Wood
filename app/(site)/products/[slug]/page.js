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
    <main className="flex-1 pt-28 pb-24 px-6 md:px-14">
      <Link href={`/collections/${product.categories?.slug}`} className="label text-mute hover:text-ink transition-colors">
        ← {product.categories?.name}
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mt-8">
        <ProductGallery
          images={images}
          name={product.name}
          nightImage={product.night_image_url}
          forceContain={product.categories?.slug === "sofas"}
        />

        <div className="flex flex-col">
          <h1 className="font-display font-semibold text-ink text-[clamp(32px,5vw,56px)] leading-[0.95]">
            {product.name}
          </h1>
          <p className="text-mute mt-3">
            {product.price ? `₦${Number(product.price).toLocaleString()}` : "Price on request"}
          </p>
          {product.description && (
            <p className="mt-8 text-ink/80 leading-relaxed max-w-md">{product.description}</p>
          )}
          <EnquireLink productId={product.id} />
          <BuyButton productId={product.id} price={product.price} />
        </div>
      </div>
    </main>
  );
}
