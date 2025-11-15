const Restaurant = require("../models/RestaurantModel");
const User = require("../models/UserModel");

// ✅ GET Restaurant + User Settings
exports.getSettings = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const userId = req.user.id; // assuming verifyToken attaches this

    // Fetch restaurant and user in parallel
    const [restaurant, user] = await Promise.all([
      Restaurant.findById(restaurantId),
      User.findById(userId).select("-password"), // exclude password
    ]);

    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      data: {
        restaurant,
        user,
      },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// ✅ UPDATE Restaurant + User Settings
exports.updateSettings = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const userId = req.user.id;

    const { restaurantData, userData } = req.body;

    // Update restaurant and user separately
    const [restaurant, user] = await Promise.all([
      Restaurant.findByIdAndUpdate(restaurantId, restaurantData, { new: true }),
      User.findByIdAndUpdate(userId, userData, { new: true }).select(
        "-password"
      ),
    ]);

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: { restaurant, user },
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
