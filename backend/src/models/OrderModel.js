const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  tableNumber: String,
  items: [
    {
      name: String,
      quantity: Number,   
      price: Number,
    },
  ],
  total: Number,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
