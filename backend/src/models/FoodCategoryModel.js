const mongoose = require("mongoose");

const foodCategorySchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // Reference to the restaurant/admin
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

foodCategorySchema.index({ restaurantId: 1, name: 1 }, { unique: true });
module.exports = mongoose.model("FoodCategory", foodCategorySchema);
