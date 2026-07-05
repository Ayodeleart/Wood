"use client";

export default function EnquireLink({ productId }) {
  function track() {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, type: "inquiry" }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <a
      href="mailto:olawoodworksynergy@gmail.com"
      onClick={track}
      className="label mt-10 border-b border-shop-text/30 pb-2 w-fit hover:border-shop-text text-shop-text transition-colors block"
    >
      Enquire About This Piece
    </a>
  );
}
