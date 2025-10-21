const FoodCategory = require("../models/FoodCategoryModel");

exports.postAddCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const existingCat = await FoodCategory.findOne({ name });
    if (existingCat) {
      res
        .status(400)
        .json({ success: false, message: "Category already added" });
    }
    const newCategory = new FoodCategory({
      restaurantId: req.user.id,
      name,
      isActive,
    });

    await newCategory.save();
    res.status(200).json({ success: true, message: "Category Added" });
  } catch (error) {
    res
      .status(501)
      .json({ success: false, message: "Server error in adding category" });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await FoodCategory.find({ restaurantId: req.user.id }).select("-restaurantId ");
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

