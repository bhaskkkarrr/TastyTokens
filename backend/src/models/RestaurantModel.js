const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin user
  address: { type: String },
  subscriptionPlan: {
    type: String,
    enum: ["FREE", "PRO", "ENTERPRISE"],
    default: "FREE",
  },
  taxRate: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  logoUrl: { type: String },
  staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // linked staff
  isActive: { type: Boolean, default: true },
  isOpen: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
