const Admin = require("../models/AdminModel");
const Table = require("../models/TableModel");
const MenuItem = require("../models/MenuItemModel");
const FoodCategory = require("../models/FoodCategoryModel");

exports.getPublicMenu = async (req, res) => {
  console.log(req.params);
  try {
    const { restaurantId, tableCode } = req.params;

    // ✅ 1. Validate restaurant
    const restaurant = await Admin.findById(restaurantId).select("-password");
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    // ✅ 2. Validate table using code + restaurant
    const table = await Table.findOne({ restaurantId, code: tableCode }).select(
      "_id name code"
    );

    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }

    // ✅ 3. Fetch all active categories
    const categories = await FoodCategory.find({
      restaurantId,
      isActive: true,
    }).lean();

    // ✅ 4. Fetch all available menu items
    const menuItems = await MenuItem.find({
      restaurantId,
      isAvailable: true,
    })
      .populate("category", "name slug")
      .lean();

    // ✅ 5. Group menu items by category
    const groupedMenu = categories.map((category) => {
      const itemsInCategory = menuItems
        .filter(
          (item) => item.category?._id?.toString() === category._id.toString()
        )
        .map((item) => ({
          _id: item._id,
          name: item.name,
          basePrice: item.basePrice,
          discountedPrice: item.discountedPrice,
          variants: item.variants, // ✅ important: list of Half/Full options
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

    // ✅ Remove categories with zero items
    const filteredMenu = groupedMenu.filter((cat) => cat.items.length > 0);

    // ✅ 6. FINAL API response
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
