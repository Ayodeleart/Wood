import { Truck, Award, ShieldCheck, PencilRuler, Leaf, Gem } from "lucide-react";
import Reveal from "@/components/Reveal";

const POINTS = [
  { icon: Truck, title: "Fast, Free Delivery", desc: "Enjoy free delivery on every order within Ijebu-Ode and beyond." },
  { icon: ShieldCheck, title: "Extended Warranty", desc: "Every piece is backed by our craftsmanship guarantee." },
  { icon: Gem, title: "Premium Quality, Accessible Prices", desc: "Direct partnerships keep prices honest without cutting corners." },
  { icon: Leaf, title: "Ethical Sourcing", desc: "Materials sourced responsibly, built with care for longevity." },
  { icon: PencilRuler, title: "Exquisite Design", desc: "Every product is chosen and crafted with an eye for detail." },
  { icon: Award, title: "Expert Design Services", desc: "Our team helps you plan a space that truly fits your life." },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#a9683e] text-paper px-6 md:px-14 py-20 md:py-28">
      <Reveal as="h2" className="font-display font-medium text-[clamp(28px,4vw,44px)] leading-[1.1] mb-14">
        Why Choose
        <br />
        Ola Wood?
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
        {POINTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 90} className="flex flex-col">
            <p.icon size={26} strokeWidth={1.3} className="mb-4" />
            <h3 className="font-medium mb-1.5">{p.title}</h3>
            <p className="text-sm text-paper/75 leading-relaxed">{p.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
