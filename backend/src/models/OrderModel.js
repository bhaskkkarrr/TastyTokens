const mongoose = require("mongoose");
const Counter = require("./CounterModel");

const OrderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // price locked at order time
  total: { type: Number, required: true },
  selectedVariant: { type: Object, default: {} }, // e.g., {size: "M"}
  addons: [
    {
      addonId: String,
      name: String,
      price: Number,
    },
  ],
  notes: String,
});

const OrderSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  table: { type: String, default: null }, // table name or null
  orderId: { type: String, index: true },
  items: [OrderItemSchema],
  pricing: {
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, default: 0 },
    serviceCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
  },
  customer: {
    name: String,
    phone: String,
  },
  orderType: {
    type: String,
    enum: ["DINE_IN", "TAKEAWAY"],
    default: "DINE_IN",
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "PREPARING", "COMPLETED", "CANCELLED"],
    default: "PENDING",
  },
  sessionId: { type: String }, // socket session id if realtime needed

  createdAt: { type: Date, default: Date.now },
});

// ✅ Auto-generate unique orderId before saving
OrderSchema.pre("save", async function (next) {
  if (this.orderId) return next();

  try {
    const result = await Counter.findOneAndUpdate(
      { restaurantId: this.restaurantId },
      { $inc: { orderSeq: 1 } },
      { new: true, upsert: true } // create if not existing
    );

    this.orderId = `ORD-${String(result.orderSeq).padStart(5, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

// pre-save hook to calculate totals if not set
OrderSchema.pre("validate", function (next) {
  // compute each item total as quantity*price + addons
  this.items = this.items.map((i) => {
    const addonsTotal = (i.addons || []).reduce(
      (s, a) => s + (a.price || 0),
      0
    );
    const total = (i.price || 0) * (i.quantity || 1) + addonsTotal;
    return { ...(i.toObject ? i.toObject() : i), total };
  });

  const subtotal = this.items.reduce((s, it) => s + (it.total || 0), 0);
  this.pricing.subtotal = subtotal;
  this.pricing.tax = this.pricing.tax || 0;
  this.pricing.serviceCharge = this.pricing.serviceCharge || 0;
  this.pricing.deliveryCharge = this.pricing.deliveryCharge || 0;
  this.pricing.discount = this.pricing.discount || 0;
  this.pricing.grandTotal =
    subtotal +
    this.pricing.tax +
    this.pricing.serviceCharge +
    this.pricing.deliveryCharge -
    this.pricing.discount;

  next();
});

// ✅ Useful indexes
OrderSchema.index({ restaurantId: 1, createdAt: -1 });
OrderSchema.index({ restaurantId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model("Order", OrderSchema);
