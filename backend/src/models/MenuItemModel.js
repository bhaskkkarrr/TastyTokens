const mongoose = require("mongoose");
const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // Reference to the restaurant/admin
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
  },
  foodType: {
    type: String,
    enum: ["veg", "non-veg", "egg"],
    default: "non-veg",
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

module.exports = mongoose.model("MenuItem", menuItemSchema);
