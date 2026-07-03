import { Home, TreePine, Briefcase, UtensilsCrossed } from "lucide-react";
import Reveal from "@/components/Reveal";

const NEEDS = [
  { icon: Home, label: "Living Room", desc: "Sofas, TV consoles & seating built for gathering." },
  { icon: UtensilsCrossed, label: "Bedroom", desc: "Bed frames, wardrobes & closets for restful spaces." },
  { icon: Briefcase, label: "Kitchen", desc: "Cabinets and storage designed for how you cook." },
  { icon: TreePine, label: "Whole Home", desc: "Ceilings, panels & finishing that tie it all together." },
];

export default function NeedsGrid() {
  return (
    <section className="px-6 md:px-14 py-20 md:py-28 border-t border-line">
      <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
        <h2 className="font-display font-medium text-ink text-[clamp(28px,4vw,44px)] leading-[1.1]">
          We have furniture
          <br />
          for all of your needs
        </h2>
        <p className="text-sm text-mute max-w-xs">
          Every piece is designed to work together — mix and match to furnish any room in your home.
        </p>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line">
        {NEEDS.map((n, i) => (
          <Reveal key={n.label} delay={i * 90} className="bg-paper p-8 md:p-10 flex flex-col gap-6 aspect-square justify-end">
            <n.icon size={32} strokeWidth={1} className="text-ink" />
            <div>
              <h3 className="text-ink font-medium mb-1">{n.label}</h3>
              <p className="text-xs text-mute leading-relaxed">{n.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
