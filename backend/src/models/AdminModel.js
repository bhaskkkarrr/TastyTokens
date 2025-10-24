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
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", adminSchema);
