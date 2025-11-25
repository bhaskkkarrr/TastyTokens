// utils/calcSingleDiscount.js
function calcSingleDiscount(basePrice, discount) {
  if (basePrice == null) return basePrice;
  if (!discount) return basePrice;

  let p = Number(basePrice);

  if (discount.type === "percentage") {
    p = p - (p * Number(discount.amount)) / 100;
  } else if (discount.type === "flat") {
    p = p - Number(discount.amount);
  }

  // round to nearest integer or 2 decimals as you prefer
  return Math.max(0, Math.round(p));
}

module.exports = calcSingleDiscount;
