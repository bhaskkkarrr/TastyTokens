const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  orderSeq: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Counter", CounterSchema);
