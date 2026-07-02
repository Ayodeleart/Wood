import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const PAGE_W = 595; // A4 at 72dpi
const PAGE_H = 842;
const MARGIN = 40;
const THUMB = 90;
const ROW_H = 110;

export async function GET(req) {
  const slug = new URL(req.url).searchParams.get("category");
  if (!slug) {
    return NextResponse.json({ error: "Missing category." }, { status: 400 });
  }

  const sb = supabaseAdmin();

  const { data: category } = await sb.from("categories").select("id, name, slug").eq("slug", slug).single();
  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  const { data: products } = await sb
    .from("products")
    .select("name, price, product_images(url, sort_order)")
    .eq("category_id", category.id);

  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let cursorY = PAGE_H - MARGIN;

  function drawHeader(p) {
    p.drawText("OLA WOOD", { x: MARGIN, y: cursorY, size: 11, font: fontBold, color: rgb(0.05, 0.05, 0.05) });
    cursorY -= 26;
    p.drawText(`${category.name} — Catalog`, { x: MARGIN, y: cursorY, size: 20, font: fontBold });
    cursorY -= 30;
  }
  drawHeader(page);

  for (const product of products || []) {
    if (cursorY - ROW_H < MARGIN) {
      page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      cursorY = PAGE_H - MARGIN;
      drawHeader(page);
    }

    const images = (product.product_images || []).sort((a, b) => a.sort_order - b.sort_order);
    const imgUrl = images[0]?.url;

    if (imgUrl) {
      try {
        const imgRes = await fetch(imgUrl);
        const imgBytes = await imgRes.arrayBuffer();
        const isPng = imgUrl.toLowerCase().endsWith(".png");
        const embedded = isPng ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
        const scale = Math.min(THUMB / embedded.width, THUMB / embedded.height);
        const w = embedded.width * scale;
        const h = embedded.height * scale;
        page.drawImage(embedded, {
          x: MARGIN + (THUMB - w) / 2,
          y: cursorY - ROW_H + (ROW_H - h) / 2,
          width: w,
          height: h,
        });
      } catch {
        // skip broken image, still list the product
      }
    }

    const textX = MARGIN + THUMB + 20;
    page.drawText(product.name || "Unnamed product", {
      x: textX,
      y: cursorY - 35,
      size: 13,
      font: fontBold,
      color: rgb(0.05, 0.05, 0.05),
    });
    page.drawText(product.price ? `\u20a6${Number(product.price).toLocaleString()}` : "Price on request", {
      x: textX,
      y: cursorY - 55,
      size: 11,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawLine({
      start: { x: MARGIN, y: cursorY - ROW_H + 5 },
      end: { x: PAGE_W - MARGIN, y: cursorY - ROW_H + 5 },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    });

    cursorY -= ROW_H;
  }

  const pdfBytes = await pdfDoc.save();
  const filename = `catalog-${category.slug}-${Date.now()}.pdf`;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "octopusfur-media";

  const { error: uploadError } = await sb.storage
    .from(bucket)
    .upload(`catalogs/${filename}`, new Blob([pdfBytes], { type: "application/pdf" }), {
      contentType: "application/pdf",
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = sb.storage.from(bucket).getPublicUrl(`catalogs/${filename}`);

  return NextResponse.json({ url: publicUrlData.publicUrl });
}
