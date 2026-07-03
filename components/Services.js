import Reveal from "@/components/Reveal";

const SERVICES = [
  {
    title: "Interior Design Consultation",
    copy: "One-on-one sessions with our designers to plan furniture, layout, and finishes around how you actually live.",
  },
  {
    title: "Custom & Made-to-Order",
    copy: "Any piece can be resized, reupholstered, or rebuilt in a different wood or fabric to fit your space exactly.",
  },
  {
    title: "Nationwide Delivery & Installation",
    copy: "White-glove delivery and assembly across Nigeria, handled by our own team — not a third-party courier.",
  },
  {
    title: "Aftercare & Warranty",
    copy: "Every piece is covered, with a dedicated line for repairs, replacement parts, and re-finishing.",
  },
];

export default function Services() {
  return (
    <section id="services" className="px-6 md:px-14 py-24 md:py-28 border-t border-line">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <span className="label text-mute">Why Choose Ola Wood</span>
          <h2 className="font-display font-semibold text-ink text-[clamp(28px,4vw,52px)] leading-[1.05] mt-2">
            Our Design Services
          </h2>
        </div>
        <p className="text-mute text-sm max-w-sm">
          We don't just sell furniture — our team helps you plan, customize, and maintain every piece in your home.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 90} className="flex flex-col">
            <span className="font-display text-3xl text-accent mb-4">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-ink text-lg mb-2">{s.title}</h3>
            <p className="text-mute text-sm leading-relaxed">{s.copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
