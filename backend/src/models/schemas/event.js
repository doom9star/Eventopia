const { Schema, SchemaTypes } = require("mongoose");

const event = new Schema(
  {
    name: { type: String },
    description: { type: String },
    images: [{ type: String }],
    planner: { type: SchemaTypes.ObjectId, ref: "users" },
    min_price: { type: Number },
    max_price: { type: Number },
    type: { type: String, enum: ["Online", "Offline"] },
  },
  { timestamps: true }
);

module.exports = event;
