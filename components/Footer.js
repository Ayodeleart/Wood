import Link from "next/link";
import Image from "next/image";

export default function Footer({ categories = [] }) {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-line">
      <div className="bg-smoke px-6 md:px-14 pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-line">
        <div>
          <div className="relative h-9 w-[150px] mb-5">
            <Image src="/logo/logo-cutout.png" alt="Ola Wood" fill className="object-contain object-left" />
          </div>
          <p className="text-mute text-sm leading-relaxed max-w-xs">
            Premium interior furniture, crafted for how you actually live — sofas, curtains, storage, and more.
          </p>
        </div>

        <div>
          <p className="label text-mute mb-4">Shop</p>
          <div className="flex flex-col gap-2.5">
            {categories.slice(0, 5).map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="text-sm text-ink hover:text-mute transition-colors">
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="label text-mute mb-4">Company</p>
          <div className="flex flex-col gap-2.5">
            <Link href="/#services" className="text-sm text-ink hover:text-mute transition-colors">Services</Link>
            <Link href="/#contact" className="text-sm text-ink hover:text-mute transition-colors">Contact</Link>
            <Link href="/account/login" className="text-sm text-ink hover:text-mute transition-colors">Sign In</Link>
          </div>
        </div>

        <div>
          <p className="label text-mute mb-4">Get in Touch</p>
          <a
            href="mailto:olawoodworksynergy@gmail.com"
            className="text-sm text-ink hover:text-mute transition-colors block mb-4 break-all"
          >
            olawoodworksynergy@gmail.com
          </a>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-mute hover:text-accent transition-colors text-sm">Instagram</a>
            <a href="#" aria-label="WhatsApp" className="text-mute hover:text-accent transition-colors text-sm">WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 pt-6 text-xs text-mute">
        <span>© {year} Ola Wood — All Rights Reserved</span>
        <div className="flex items-center gap-6">
          <span>Ijebu-Ode, Ogun State</span>
          <span className="text-mute/70 flex items-center gap-1.5">
            <Image src="/icons/octopusfur.svg" alt="" width={12} height={12} className="opacity-70" />
            Built by octopusfur
          </span>
        </div>
      </div>
      </div>
    </footer>
  );
}
