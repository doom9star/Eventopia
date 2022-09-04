const { Schema } = require("mongoose");

const event = new Schema(
  {
    name: { type: String },
    description: { type: String },
    images: [{ type: String }],
    min_price: { type: Number, min: 0 },
    max_price: { type: Number, min: 0 },
    type: { type: String, enum: ["Online", "Offline"] },
  },
  { timestamps: true }
);

module.exports = event;
