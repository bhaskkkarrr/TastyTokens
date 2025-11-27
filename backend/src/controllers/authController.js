const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/RestaurantModel");
const User = require("../models/UserModel");
require("dotenv").config();

exports.postSignup = async (req, res) => {
  console.log("Signup data", req.body);

  const { restaurantName, ownerName, email, password, address, phoneNumber } =
    req.body;

  try {
    // 🔍 Check if email or phone already registered
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "Email or phone number already registered",
      });

    // 🔑 Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 🏢 Create restaurant entry
    const restaurant = new Restaurant({
      name: restaurantName,
      address,
    });
    await restaurant.save();

    // 👤 Create user (admin)
    const user = new User({
      restaurantId: restaurant._id,
      name: ownerName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "admin",
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Restaurant and admin registered successfully",
      restaurant,
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.postLogin = async (req, res) => {
  console.log("Login data", req.body);
  try {
    const { email, password } = req.body;

    // Find user but EXCLUDE sensitive fields
    const user = await User.findOne({ email })
      .select("+password") // Needed to verify password
      .populate(
        "restaurantId",
        "name address isOpen isActive currency taxRate" // Only include allowed fields
      );

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    // JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        restaurantId: user.restaurantId._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove sensitive fields manually from output
    const safeUser = {
      name: user.name,
      role: user.role,
      restaurantId: user.restaurantId._id,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
      restaurantDetails: user.restaurantId,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
