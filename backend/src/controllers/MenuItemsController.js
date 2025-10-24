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


