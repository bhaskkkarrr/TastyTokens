const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
require("dotenv").config();

exports.postSignup = async (req, res) => {
  console.log("Signup data", req.body);

  const {
    restaurantName,
    ownerName,
    email,
    password,
    address,
    phoneNumber,
    role,
  } = req.body;

  try {
    // Uniqueness checks
    const existingPhone = await Admin.findOne({ phoneNumber });
    if (existingPhone)
      return res
        .status(400)
        .json({ success: false, message: "Phone number already registered" });

    const existingEmail = await Admin.findOne({ email });
    if (existingEmail)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newRestaurant = new Admin({
      restaurantName,
      ownerName,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
      role,
    });

    await newRestaurant.save();

    // ✅ Generate QR Code for the restaurant’s public menu

    const menuPageUrl = `${process.env.BASE_URL}/${newRestaurant._id}`;
    const qrCodeUrl = await QRCode.toDataURL(menuPageUrl);

    // ✅ Save QR code and menu URL in DB
    newRestaurant.qrCodeUrl = qrCodeUrl;
    newRestaurant.menuPageUrl = menuPageUrl;
    await newRestaurant.save();

    res.status(201).json({
      success: true,
      message: "Restaurant registered successfully",
      restaurant: newRestaurant,
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
    // Check if user exists
    const user = await Admin.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    // Compare passwords
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Successful login
    // Generating token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res
      .status(200)
      .json({ success: true, message: "Login done :xD", token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
