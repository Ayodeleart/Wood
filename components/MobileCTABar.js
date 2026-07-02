const PHONE_DISPLAY = "+234 806 380 4843";
const PHONE_TEL = "+2348063804843";
const WHATSAPP_NUMBER = "2348063804843";

export default function MobileCTABar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex border-t border-line bg-paper">
      <a
        href={`tel:${PHONE_TEL}`}
        className="flex-1 flex items-center justify-center gap-2 py-4 label text-ink border-r border-line active:bg-smoke"
      >
        Call
      </a>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 py-4 label bg-ink text-paper active:bg-ink/90"
      >
        WhatsApp
      </a>
    </div>
  );
}
