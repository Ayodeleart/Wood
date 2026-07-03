import Reveal from "@/components/Reveal";

const SERVICES = [
  {
    title: "Home & Space Consultation",
    copy: "A designer visits or video-calls to walk through your space and help you choose pieces that actually fit it.",
  },
  {
    title: "Custom & Bespoke Builds",
    copy: "Need a size, wood tone, or fabric we don't stock? We build one-off pieces to your exact spec.",
  },
  {
    title: "3D Space Visualization",
    copy: "See your room furnished before you buy — a rendered layout of your actual space with the pieces in place.",
  },
  {
    title: "Corporate & Hospitality Projects",
    copy: "Furnishing an office, hotel, or event space? We handle bulk orders and full-room projects end to end.",
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
