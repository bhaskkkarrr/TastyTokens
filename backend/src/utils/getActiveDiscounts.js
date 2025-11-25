// utils/getActiveDiscounts.js
const Discount = require("../models/DiscountModel");

async function getActiveDiscountsForRestaurant(restaurantId) {
  const now = new Date();

  // Active if:
  // (no startDate OR startDate <= now) AND (no endDate OR endDate >= now) AND active=true
  const discounts = await Discount.find({
    restaurantId,
    active: true,
    $and: [
      {
        $or: [
          { startDate: { $lte: now } },
          { startDate: null },
          { startDate: { $exists: false } },
        ],
      },
      {
        $or: [
          { endDate: { $gte: now } },
          { endDate: null },
          { endDate: { $exists: false } },
        ],
      },
    ],
  });
  console.log("Get dis", discounts);
  return discounts;
}

module.exports = getActiveDiscountsForRestaurant;
