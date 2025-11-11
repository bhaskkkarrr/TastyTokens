const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true,
  },
  name: { type: String, required: true }, // e.g. “Table 1”
  code: { type: String, unique: true }, // stable unique token for URL
  qrUrl: String, // actual encoded URL (used in QR)
  qrImage: String, // base64 Data URL or cloud URL
  isOcuppied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

tableSchema.index({ restaurantId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Table", tableSchema);
