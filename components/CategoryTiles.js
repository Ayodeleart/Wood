import Image from "next/image";
import Link from "next/link";

export default function CategoryTiles({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="px-6 md:px-14 py-20 md:py-28 border-t border-line">
      <span className="label text-mute">Explore Our Collections</span>
      <h2 className="font-display font-medium text-ink text-[clamp(28px,4vw,44px)] leading-[1.1] mt-3 mb-14">
        Crafted For Every Space
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {categories.slice(0, 6).map((cat) => (
          <Link key={cat.slug} href={`/collections/${cat.slug}`} className="group flex flex-col">
            <div className="relative aspect-[4/3] bg-smoke overflow-hidden">
              {cat.heroImages?.[0] && (
                <Image
                  src={cat.heroImages[0]}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              )}
            </div>
            <h3 className="label text-ink mt-3">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
