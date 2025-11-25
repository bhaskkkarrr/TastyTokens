const Discount = require("../models/DiscountModel");
const MenuItem = require("../models/MenuItemModel");

module.exports = async function applyDiscountsToMenu(restaurantId) {
  try {
    // Step 1: Get all active discounts
    const now = new Date();
    const discounts = await Discount.find({
      restaurantId,
      active: true,
      $or: [
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: null, endDate: null }, // timeless discount
      ],
    });

    // Step 2: Fetch menu items of this restaurant
    const menuItems = await MenuItem.find({ restaurantId });

    // Step 3: Clear old discounts
    for (let item of menuItems) {
      item.discountedPrice = null;
      item.variants?.forEach((v) => (v.discountedPrice = null));
    }

    // Step 4: Apply discounts
    discounts.forEach((disc) => {
      menuItems.forEach((item) => {
        // Apply only if discount target matches
        if (disc.appliesTo === "all") {
          applyDiscount(item, disc);
        }
        if (
          disc.appliesTo === "category" &&
          disc.category?.toString() === item.category?.toString()
        ) {
          applyDiscount(item, disc);
        }
        if (
          disc.appliesTo === "item" &&
          disc.item?.toString() === item._id.toString()
        ) {
          applyDiscount(item, disc);
        }
      });
    });

    // Step 5: Save updated items
    for (let item of menuItems) {
      await item.save();
    }

    console.log("Discounts applied successfully.");
  } catch (e) {
    console.error("Error in applyDiscountsToMenu:", e);
  }
};

function applyDiscount(item, disc) {
  // Handle base price
  if (item.basePrice) {
    if (disc.type === "percentage") {
      item.discountedPrice = Math.round(
        item.basePrice - (item.basePrice * disc.amount) / 100
      );
    } else if (disc.type === "flat") {
      item.discountedPrice = Math.max(0, item.basePrice - disc.amount);
    }
  }

  // Handle variants
  if (item.variants && item.variants.length > 0) {
    item.variants = item.variants.map((v) => {
      if (disc.type === "percentage") {
        v.discountedPrice = Math.round(v.price - (v.price * disc.amount) / 100);
      } else if (disc.type === "flat") {
        v.discountedPrice = Math.max(0, v.price - disc.amount);
      }
      return v;
    });
  }
}
