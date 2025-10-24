const Admin = require("../models/AdminModel");
const Table = require("../models/TableModel");
const MenuItem = require("../models/MenuItemModel");

exports.getPublicMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // 1️⃣ Fetch restaurant
    const restaurant = await Admin.findById(restaurantId).select(
      "_id name slug"
    );
    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    // 2️⃣ Fetch table (you can use code or _id depending on QR logic)
    const table = await Table.findOne({ restaurantId }).select("_id name code");
    if (!table)
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });

    // 3️⃣ Fetch available menu items
    const menuItems = await MenuItem.find({
      restaurantId,
      isAvailable: true,
    }).lean();

    // 4️⃣ Group menu items by category
    const groupedMenu = menuItems.reduce((acc, item) => {
      const existingCategory = acc.find((cat) => cat.name === item.category);
      const formattedItem = {
        _id: item._id,
        name: item.name,
        price: item.price,
        foodType: item.foodType,
        imageUrl: item.imageUrl,
      };

      if (existingCategory) {
        existingCategory.items.push(formattedItem);
      } else {
        acc.push({
          _id: item.category.toLowerCase().replace(/\s+/g, "-"),
          name: item.category,
          items: [formattedItem],
        });
      }
      return acc;
    }, []);

    // 5️⃣ Send structured response
    return res.status(200).json({
      restaurant,
      table,
      menu: groupedMenu,
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
