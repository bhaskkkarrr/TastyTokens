const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    index: true,
  },
  // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional - for user-specific
  title: String,
  body: String,
  channel: {
    type: String,
    enum: ["IN_APP", "EMAIL", "SMS", "PUSH"],
    default: "IN_APP",
  },
  read: { type: Boolean, default: false },
  meta: { type: Object, default: {} },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Notification", NotificationSchema);
