const FoodCategory = require("../models/FoodCategoryModel");
const MenuItem = require("../models/MenuItemModel");
const slugify = require("slugify");

/**
 * ✅ Create a new food category
 */
exports.postAddCategory = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const restaurantId = req.user.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if already exists for same restaurant
    const exists = await FoodCategory.findOne({ restaurantId, name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const newCategory = await FoodCategory.create({
      restaurantId,
      name,
      slug,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("postAddCategory error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating category",
      error: error.message,
    });
  }
};

/**
 * ✅ Get all categories for a restaurant
 */
exports.getAllCategory = async (req, res) => {
  try {
    const restaurantId = req.user.id;

    const categories = await FoodCategory.find({ restaurantId })
      .sort({ createdAt: 1 })
      .select("-restaurantId");

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("getAllCategory error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching categories",
      error: error.message,
    });
  }
};

/**
 * ✅ Update category (rename, activate/deactivate)
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const restaurantId = req.user.id;

    const category = await FoodCategory.findOne({
      _id: id,
      restaurantId,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ Check duplicate names
    if (name) {
      const exists = await FoodCategory.findOne({
        restaurantId,
        name,
        _id: { $ne: id },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Another category already has this name",
        });
      }

      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }

    // ✅ Prevent deactivating category if it's linked with menu items
    if (isActive !== undefined) {
      const newStatus = isActive === "true" || isActive === true;

      if (!newStatus) {
        // User is trying to deactivate category
        const linkedItem = await MenuItem.findOne({
          restaurantId,
          category: id,
        });

        if (linkedItem) {
          return res.status(400).json({
            success: false,
            message:
              "Cannot deactivate category. It is linked with menu items.",
          });
        }
      }

      category.isActive = newStatus;
    }

    await category.save();

    return res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("updateCategory error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

/**
 * ✅ Delete category (only if no menu items use it)
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.user.id;

    const category = await FoodCategory.findOne({
      _id: id,
      restaurantId,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ Check if any menu items are using this category
    const linkedItems = await MenuItem.findOne({
      restaurantId,
      category: id,
    });

    if (linkedItems) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category. It is linked with menu items.",
      });
    }

    await FoodCategory.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("deleteCategory error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting category",
      error: error.message,
    });
  }
};
