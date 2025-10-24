const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  name: { type: String, required: true }, // e.g. “Table 1”
  code: { type: String, unique: true }, // stable unique token for URL
  qrUrl: String, // actual encoded URL (used in QR)
  qrImage: String, // base64 Data URL or cloud URL
  scans: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Table", tableSchema);
