const MenuItem = require("../models/MenuItemModel");
const fs = require("fs");
const cloudinary = require("../config/cloudinaryConfig");
const path = require("path");

exports.postAddMenuItems = async (req, res) => {
  // multer will put the file in req.file
  try {
    const { name, price, category, foodType, isAvailable } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Name and price are required" });
    }

    if (!req.file) {
      // you might want to allow items with no image
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    // Upload local file to Cloudinary
    const localPath = req.file.path;

    // Optionally use folder per restaurant: `uploads/${req.user.id}`
    const uploadOptions = {
      folder: `digithali/${req.user?.id || "public"}`,
      use_filename: true,
      unique_filename: true,
      resource_type: "image",
    };

    const result = await cloudinary.uploader.upload(localPath, uploadOptions);

    // Delete local file
    fs.unlink(localPath, (err) => {
      if (err) console.warn("Failed to delete local file:", err);
    });

    // Save to DB
    const menuItem = new MenuItem({
      name,
      price,
      category,
      foodType,
      isAvailable: isAvailable === "true" || isAvailable === true,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
      restaurantId: req.user?.id ?? null,
    });

    await menuItem.save();

    return res.status(201).json({ success: true, menuItem });
  } catch (err) {
    console.error("Add menu item error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

exports.getAllMenuItems = async (req, res) => {
  try {
    // Fetch all menu items for this restaurant
    const menuItems = await MenuItem.find({ restaurantId: req.user.id });

    return res.status(200).json({
      success: true,
      menuItems,
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in fetching menu items",
      error: error.message,
    });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await MenuItem.findById(id);
    if (!menu) {
      res.status(401).json({ success: false, message: "No menu item founded" });
    }

    // Delete image from Cloudinary if exists
    if (menu.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(menu.imagePublicId);
        console.log(`Deleted Cloudinary image: ${menu.imagePublicId}`);
      } catch (cloudErr) {
        console.error("Error deleting Cloudinary image:", cloudErr.message);
      }
    }

    // Delete from MongoDB
    await menu.deleteOne();

    res.json({ success: true, message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(501).json({ success: false, message: "Error deleting tables" });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    const { name, price, category, foodType, isAvailable, isBestSeller } = req.body;

    if (name) menuItem.name = name;
    if (price) menuItem.price = Number(price);
    if (category) menuItem.category = category;
    if (foodType) menuItem.foodType = foodType;
    if (isAvailable !== undefined)
      menuItem.isAvailable = isAvailable === "true" || isAvailable === true;
    if (isBestSeller !== undefined)
      menuItem.isBestSeller = isBestSeller === "true" || isBestSeller === true;

    // if new image provided, upload and replace
    if (req.file) {
      if (menuItem.imagePublicId) {
        await cloudinary.uploader.destroy(menuItem.imagePublicId);
      }
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "tastytokens/menuItems",
      });
      menuItem.imageUrl = uploadResult.secure_url;
      menuItem.imagePublicId = uploadResult.public_id;
    }

    await menuItem.save();

    res.json({ success: true, updatedItem: menuItem });
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update menu item",
      error: error.message,
    });
  }
};
