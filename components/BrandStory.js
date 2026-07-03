import Reveal from "@/components/Reveal";

export default function BrandStory() {
  return (
    <section className="grid md:grid-cols-2 gap-8 md:gap-16 px-6 md:px-14 py-20 md:py-28 border-t border-line">
      <Reveal>
        <span className="label text-mute">About Us</span>
        <h2 className="font-display font-medium text-ink text-[clamp(28px,4vw,44px)] leading-[1.1] mt-3">
          A Brand Built on Craft and Comfort
        </h2>
      </Reveal>
      <Reveal delay={100} className="flex flex-col justify-center">
        <p className="text-mute leading-relaxed">
          Ola Wood brings together architecture, interior design, and furniture-making under one roof.
          From the first sketch to the final piece in your home, we design and build with care —
          combining premium materials, skilled craftsmanship, and a deep respect for how people actually
          live in their spaces.
        </p>
        <a href="#services" className="label border-b border-ink/30 pb-2 w-fit mt-6 hover:border-ink transition-colors">
          More About Us
        </a>
      </Reveal>
    </section>
  );
}
