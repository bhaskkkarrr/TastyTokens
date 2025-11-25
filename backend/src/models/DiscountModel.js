const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  type: { type: String, enum: ["percentage", "flat"], required: true },
  amount: { type: Number, required: true },
  appliesTo: {
    type: String,
    enum: ["all", "category", "item"],
    default: "all",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodCategory",
    default: null,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    default: null,
  },
  startDate: Date,
  endDate: Date,
  active: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Discount", discountSchema);
