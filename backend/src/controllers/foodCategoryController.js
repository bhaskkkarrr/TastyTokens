const FoodCategory = require("../models/FoodCategoryModel");

// Controller: Add Category
exports.postAddCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const restaurantId = req.user.id; // comes from auth middleware

    // Check if category already exists for this restaurant
    const existingCat = await FoodCategory.findOne({ restaurantId, name });
    if (existingCat) {
      return res
        .status(400)
        .json({ success: false, message: "Category already added" });
    }

    const newCategory = new FoodCategory({
      restaurantId,
      name,
      isActive,
    });

    await newCategory.save();
    res
      .status(201)
      .json({ success: true, message: "Category added", newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await FoodCategory.find({
      restaurantId: req.user.id,
    }).select("-restaurantId ");
    if (categories) {
      res
        .status(200)
        .json({ success: true, message: "All food categories", categories });
    } else {
      res.status(400).json({ success: false, message: "No category added" });
    }
  } catch (error) {
    res
      .status(501)
      .json({ success: false, message: "Server error in getting category" });
  }
};

exports.deleteCategory = async (req, res) => {
  res.status(201).json({ success: true, message: "Category deleted" });
};
