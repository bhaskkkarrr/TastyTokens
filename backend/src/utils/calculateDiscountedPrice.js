// utils/calculateDiscountedPrice.js
const calcSingleDiscount = require("./calcSingleDiscount");

function calculateDiscountedPrice(item, discounts = []) {
  const basePrice = item.basePrice ?? null;
  if (basePrice == null) return null;

  // gather applicable discounts for this item
  const applicable = discounts.filter((d) => {
    if (d.appliesTo === "all") return true;
    if (
      d.appliesTo === "category" &&
      String(d.category) === String(item.category)
    )
      return true;
    if (d.appliesTo === "item" && String(d.item) === String(item._id))
      return true;
    return false;
  });

  if (applicable.length === 0) return basePrice;

  // compute price per discount and pick the lowest final price (max saving)
  const finalPrices = applicable.map((d) => calcSingleDiscount(basePrice, d));
  const minPrice = Math.min(...finalPrices);

  return minPrice;
}

module.exports = calculateDiscountedPrice;
