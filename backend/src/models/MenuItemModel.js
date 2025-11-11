const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Half / Full / Medium
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  isAvailable: { type: Boolean, default: true },
});

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // Reference to the restaurant/admin
    required: true,
    index: true, // ✅ required for fast SaaS multi-tenant queries
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  description: { type: String },
  basePrice: { type: Number },
  discountedPrice: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "FoodCategory", index:true },
  variants: [VariantSchema],
  isVeg: {
    type: Boolean,
    default: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  imageUrl: { type: String }, // cloudinary secure_url
  imagePublicId: { type: String }, // cloudinary public_id
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Important indexes for scaling SaaS
menuItemSchema.index({ restaurantId: 1, name: 1 });
menuItemSchema.index({ restaurantId: 1, category: 1 });

module.exports = mongoose.model("MenuItem", menuItemSchema);
