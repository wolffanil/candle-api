const mongoose = require("mongoose");

const candleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    smell: {
      type: String,
      required: true,
    },
    volume: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    photoUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const candle = mongoose.models.Candle || mongoose.model("Candle", candleSchema);

module.exports = candle;
