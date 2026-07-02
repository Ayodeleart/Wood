import { NextResponse } from "next/server";
import sharp from "sharp";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

async function removeBackground(buffer) {
  const form = new FormData();
  form.append("image_file", new Blob([buffer]), "image.jpg");
  form.append("size", "auto");

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`remove.bg failed (${res.status}): ${text}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

// remove.bg gives a clean cutout but no shadow for general products (only cars get
// that from their API). A flat cutout on white reads as a sticker, not a photo — so we
// synthesize a soft contact shadow from the cutout's own silhouette before flattening.
// Built with raw pixel buffers deliberately — sharp's extend()/joinChannel() silently
// upconvert single-channel masks to RGB when given an {r,g,b} background, which corrupts
// the alpha math. Manual buffers sidestep that entirely.
async function addGroundShadow(transparentPngBuffer) {
  const meta = await sharp(transparentPngBuffer).metadata();
  const { width, height } = meta;

  const footprintHeight = Math.round(height * 0.32);
  const offsetTop = height - footprintHeight - Math.round(height * 0.05);

  // Squash the cutout's alpha silhouette into a flat "footprint" band and blur it soft.
  const { data: bandRaw } = await sharp(transparentPngBuffer)
    .extractChannel("alpha")
    .resize(width, footprintHeight, { fit: "fill" })
    .blur(30)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Paste that band into a full-height alpha buffer at the right vertical offset,
  // scaling intensity down so it reads as a shadow (~50% max) rather than a silhouette.
  const fullAlpha = Buffer.alloc(width * height, 0);
  for (let y = 0; y < footprintHeight; y++) {
    const destY = offsetTop + y;
    if (destY < 0 || destY >= height) continue;
    for (let x = 0; x < width; x++) {
      fullAlpha[destY * width + x] = Math.round(bandRaw[y * width + x] * 0.5);
    }
  }

  // Black RGB + that alpha buffer = the shadow layer, fully transparent everywhere else.
  const rgba = Buffer.alloc(width * height * 4, 0);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4 + 3] = fullAlpha[i];
  }
  const shadowLayer = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();

  return sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite([
      { input: shadowLayer, left: 0, top: 0 },
      { input: transparentPngBuffer, left: 0, top: 0 },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();
}

const REMOVE_BG_KEY = process.env.REMOVE_BG_API_KEY;
const REMOVE_BG_CONFIGURED = Boolean(REMOVE_BG_KEY) && !REMOVE_BG_KEY.includes("PASTE_YOUR");

// Runs background removal + shadow only if the caller explicitly asked for it AND
// remove.bg is actually configured. Otherwise (toggle off, no key yet, or the call
// fails for any reason — quota, bad key, etc.) falls back to just normalizing the
// original photo as-is.
async function processProductImage(inputBuffer, wantsRemoveBg) {
  if (wantsRemoveBg && REMOVE_BG_CONFIGURED) {
    try {
      const transparentPng = await removeBackground(inputBuffer);
      return { buffer: await addGroundShadow(transparentPng), ext: "jpg", contentType: "image/jpeg" };
    } catch (err) {
      console.error("remove.bg failed, falling back to original image:", err.message);
    }
  }

  // If the uploaded file already has real transparency (manually background-removed
  // before upload), preserve it as a PNG instead of flattening to JPEG — flattening a
  // transparent image to JPEG defaults to a BLACK backdrop, which is the bug we just hit.
  const meta = await sharp(inputBuffer).metadata();
  if (meta.hasAlpha) {
    const pngBuffer = await sharp(inputBuffer).png().toBuffer();
    return { buffer: pngBuffer, ext: "png", contentType: "image/png" };
  }

  const jpegBuffer = await sharp(inputBuffer).jpeg({ quality: 92 }).toBuffer();
  return { buffer: jpegBuffer, ext: "jpg", contentType: "image/jpeg" };
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    console.log("[upload] received file:", file.name, file.type, file.size, "-> buffer bytes:", inputBuffer.length);

    let mode2 = formData.get("mode"); // "hero" skips background removal entirely
    const wantsRemoveBg = formData.get("removeBg") === "true";

    let result;
    if (mode2 === "hero") {
      const heroMeta = await sharp(inputBuffer).metadata();
      if (heroMeta.hasAlpha) {
        result = { buffer: await sharp(inputBuffer).png().toBuffer(), ext: "png", contentType: "image/png" };
      } else {
        result = { buffer: await sharp(inputBuffer).jpeg({ quality: 90 }).toBuffer(), ext: "jpg", contentType: "image/jpeg" };
      }
    } else {
      result = await processProductImage(inputBuffer, wantsRemoveBg);
    }

    console.log("[upload] processed buffer bytes:", result.buffer.length, "ext:", result.ext);

    // 3. Upload to Supabase Storage
    const filename = `${crypto.randomUUID()}.${result.ext}`;
    const sb = supabaseAdmin();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "octopusfur-media";
    const uploadBlob = new Blob([result.buffer], { type: result.contentType });
    const { error: uploadError } = await sb.storage
      .from(bucket)
      .upload(filename, uploadBlob, { contentType: result.contentType });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = sb.storage.from(bucket).getPublicUrl(filename);
    console.log("[upload] uploaded to supabase as:", filename, "public url:", publicUrlData.publicUrl);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Upload failed." }, { status: 500 });
  }
}
