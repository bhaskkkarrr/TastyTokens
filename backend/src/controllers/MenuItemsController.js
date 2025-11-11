const MenuItem = require("../models/MenuItemModel");
const Category = require("../models/FoodCategoryModel");
const fs = require("fs");
const cloudinary = require("../config/cloudinaryConfig");
const generateInitialsImage = require("../utils/generateInitialsImage");

// ✅ Helper: Get initials
function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

exports.postAddMenuItems = async (req, res) => {
  console.log(req.body);
  try {
    let {
      name,
      description,
      basePrice,
      discountedPrice,
      category,
      variants,
      isVeg,
      isAvailable,
      isBestSeller,
    } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    // ✅ Validate category belongs to this restaurant
    const validCategory = await Category.findOne({
      _id: category,
      restaurantId: req.user.id,
    });

    if (!validCategory) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Create the category first.",
      });
    }

    // ✅ Parse variants JSON
    if (variants && typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for variants",
        });
      }
    }

    if (!Array.isArray(variants)) variants = [];

    let imageUrl = null;
    let imagePublicId = null;

    // ✅ A. If image is uploaded → upload to Cloudinary
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: `digithali/${req.user.id}/menu`,
      });

      imageUrl = upload.secure_url;
      imagePublicId = upload.public_id;

      fs.unlink(req.file.path, () => {});
    } else {
      // generate initials
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      // create avatar
      const localPath = generateInitialsImage(initials);

      // upload to Cloudinary
      const upload = await cloudinary.uploader.upload(localPath, {
        folder: `digithali/${req.user.id}/menu`,
      });

      imageUrl = upload.secure_url;
      imagePublicId = upload.public_id;

      fs.unlink(localPath, () => {});
    }

    // ✅ Create menu item
    const newItem = await MenuItem.create({
      restaurantId: req.user.id,
      name,
      description: description || "",
      basePrice: basePrice ? Number(basePrice) : null,
      discountedPrice: discountedPrice ? Number(discountedPrice) : null,
      category,
      variants,
      isVeg: isVeg === "false" ? false : true,
      isAvailable: isAvailable === "false" ? false : true,
      isBestSeller: isBestSeller === "true" || false,
      imageUrl,
      imagePublicId,
    });

    return res.status(201).json({
      success: true,
      menuItem: newItem,
    });
  } catch (err) {
    console.error("Add menu item error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ No changes required below — update & delete will continue to work normally
exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ restaurantId: req.user.id })
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      menuItems: items,
    });
  } catch (err) {
    console.error("Fetch Menu Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await MenuItem.findOne({
      _id: id,
      restaurantId: req.user.id,
    });

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });

    // ✅ Delete Cloudinary image ONLY if uploaded (not initials)
    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    await item.deleteOne();

    res.json({ success: true, message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("Delete Menu Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateMenuItem = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;

    let item = await MenuItem.findOne({
      _id: id,
      restaurantId: req.user.id,
    });

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });

    let {
      name,
      description,
      basePrice,
      discountedPrice,
      category,
      variants,
      isVeg,
      isAvailable,
      isBestSeller,
    } = req.body;

    // ✅ Parse variants JSON
    if (variants && typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON in variants",
        });
      }
    }

    if (name) item.name = name;
    if (description) item.description = description;
    if (basePrice) item.basePrice = Number(basePrice);
    if (discountedPrice) item.discountedPrice = Number(discountedPrice);
    if (variants) item.variants = variants;
    if (category) item.category = category;

    if (isVeg !== undefined) item.isVeg = isVeg === "true";
    if (isAvailable !== undefined) item.isAvailable = isAvailable === "true";
    if (isBestSeller !== undefined) item.isBestSeller = isBestSeller === "true";

    // ✅ New uploaded image → replace Cloudinary image
    if (req.file) {
      if (item.imagePublicId) {
        await cloudinary.uploader.destroy(item.imagePublicId);
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: `digithali/${req.user.id}/menu`,
      });

      item.imageUrl = upload.secure_url;
      item.imagePublicId = upload.public_id;

      fs.unlink(req.file.path, () => {});
    }

    await item.save();

    res.json({ success: true, updatedItem: item });
  } catch (err) {
    console.error("Update Menu Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
