// Transparent PNG cutouts (manually background-removed before upload) should show the
// full image with the site's own background showing through — no crop, no visible box.
// Regular opaque photos should fill their frame edge-to-edge with no border.
export function imageFitClass(url) {
  if (!url) return "object-cover";
  return url.toLowerCase().endsWith(".png") ? "object-contain" : "object-cover";
}
