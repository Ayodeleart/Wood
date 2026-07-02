const STEPS = [
  { n: "01", title: "Consultation", desc: "We learn your space, style, and budget." },
  { n: "02", title: "Selection", desc: "Choose from our catalog or request custom work." },
  { n: "03", title: "Crafting", desc: "Each piece is built with premium materials and care." },
  { n: "04", title: "Delivery", desc: "Safe, timely delivery anywhere in Nigeria." },
  { n: "05", title: "Setup", desc: "We install and style it exactly where it belongs." },
];

export default function ProcessSteps() {
  return (
    <section className="hidden md:block px-14 py-28 border-t border-line">
      <span className="label text-mute">Our Process</span>
      <h2 className="font-display font-semibold text-ink text-[clamp(28px,4vw,52px)] leading-[1.05] mt-2 mb-14">
        From Selection To Setup
      </h2>
      <div className="grid grid-cols-5 gap-6">
        {STEPS.map((s) => (
          <div key={s.n} className="flex flex-col">
            <span className="font-display text-3xl text-mute mb-4">{s.n}</span>
            <h3 className="text-ink font-medium mb-2">{s.title}</h3>
            <p className="text-sm text-mute leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
