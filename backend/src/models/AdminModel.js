const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  restaurantName: { type: String },
  ownerName: { type: String },
  role: {
    type: String,
    enum: ["admin", "superadmin", "staff", "customer"],
    default: "customer",
  },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String },
  qrCodeUrl: String, // ✅ store generated QR code image URL
  menuPageUrl: String, // ✅ link to dynamic menu route
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", adminSchema);
