const Table = require("../models/TableModel");
const MenuItem = require("../models/MenuItemModel");
const FoodCategory = require("../models/FoodCategoryModel");
const Restaurant = require("../models/RestaurantModel");

const applyDiscountsToMenu = require("../utils/applyDiscount");
const DiscountModel = require("../models/DiscountModel");
const calculateDiscountedPrice = require("../utils/calculateDiscountedPrice");
const getActiveDiscountsForRestaurant = require("../utils/getActiveDiscounts");

exports.getPublicMenu = async (req, res) => {
  try {
    const { restaurantId, tableCode } = req.params;

    // 1️⃣ Validate restaurant
    const restaurant = await Restaurant.findById(restaurantId).select(
      "-password"
    );
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    // 2️⃣ Validate table
    const table = await Table.findOne({ restaurantId, code: tableCode }).select(
      "_id name code"
    );
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    // 3️⃣ Fetch all active categories
    const categories = await FoodCategory.find({
      restaurantId,
      isActive: true,
    }).lean();

    // 4️⃣ Fetch all menu items
    let items = await MenuItem.find({
      restaurantId,
      isAvailable: true,
    })
      .populate("category", "name slug")
      .lean();

    // 5️⃣ Fetch active discounts
    const discounts = await getActiveDiscountsForRestaurant(restaurantId);

    // 6️⃣ Add discountedPrice to items + to variants
    const finalItems = items.map((item) => {
      const discountedPrice = calculateDiscountedPrice(item, discounts);

      const variants = Array.isArray(item.variants)
        ? item.variants.map((v) => ({
            ...v,
            discountedPrice: calculateDiscountedPrice(
              { basePrice: v.price, category: item.category, _id: item._id },
              discounts
            ),
          }))
        : [];

      return {
        ...item,
        discountedPrice,
        variants,
      };
    });

    // 7️⃣ Group items by category
    const groupedMenu = categories.map((category) => {
      const itemsInCategory = finalItems
        .filter(
          (item) => item.category?._id?.toString() === category._id.toString()
        )
        .map((item) => ({
          _id: item._id,
          name: item.name,
          basePrice: item.basePrice,
          discountedPrice: item.discountedPrice,
          variants: item.variants,
          isBestSeller: item.isBestSeller,
          isVeg: item.isVeg,
          imageUrl: item.imageUrl,
        }));

      return {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        items: itemsInCategory,
      };
    });

    // 8️⃣ Remove categories with no items
    const filteredMenu = groupedMenu.filter((cat) => cat.items.length > 0);

    // 9️⃣ Final response
    return res.status(200).json({
      success: true,
      restaurant,
      table,
      menu: filteredMenu,
    });
  } catch (error) {
    console.error("Error fetching public menu:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching public menu",
      error: error.message,
    });
  }
};
