const { Schema, SchemaTypes } = require("mongoose");

const event = new Schema(
  {
    name: String,
    price: Number,
    images: [String],
    states: [String],
    description: String,
    type: { type: String, enum: ["Online", "Offline"] },
    planner: { type: SchemaTypes.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = event;
