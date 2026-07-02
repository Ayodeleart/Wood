// Single source of truth for "which photo do we show for this product right now."
// Used everywhere a product image renders, so night-mode behavior can't drift
// between the homepage rail, collection grid, product page, etc.
export function getProductDisplayImage(product, night) {
  if (night && product?.night_image_url) return product.night_image_url;
  return product?.image || null;
}
