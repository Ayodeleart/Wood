import Link from "next/link";
import { PencilRuler, Building2, Sofa, ClipboardList, Lightbulb } from "lucide-react";

const SERVICES = [
  {
    icon: PencilRuler,
    label: "Architectural Design",
    desc: "Innovative designs that blend functionality with aesthetics.",
    href: "/collections/architectural-design",
  },
  {
    icon: Building2,
    label: "Building Construction",
    desc: "From foundation to structure, built with precision.",
    href: "/collections/building-construction",
  },
  {
    icon: Lightbulb,
    label: "Interior Design & Decoration",
    desc: "Beautiful interiors that reflect your lifestyle.",
    href: "/collections/interior-design",
  },
  {
    icon: Sofa,
    label: "Furniture & Joinery",
    desc: "Custom furniture and premium craftsmanship.",
    href: "/collections/sofas",
  },
  {
    icon: ClipboardList,
    label: "Project Management",
    desc: "Seamless coordination from start to finish.",
    href: "/collections/project-management",
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="px-6 md:px-14 py-20 md:py-28 border-t border-line">
      <span className="label text-mute">What We Do</span>
      <h2 className="font-display font-semibold text-ink text-[clamp(28px,5vw,52px)] leading-[1.05] mt-2 mb-12">
        From foundation to finishing
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-line border border-line">
        {SERVICES.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group bg-paper p-6 md:p-8 flex flex-col gap-4 hover:bg-smoke transition-colors"
          >
            <s.icon size={28} strokeWidth={1.5} className="text-ink" />
            <span className="text-sm md:text-base text-ink leading-snug">{s.label}</span>
            <span className="hidden md:block text-xs text-mute leading-relaxed -mt-2">{s.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
