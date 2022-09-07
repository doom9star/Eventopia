const { Schema, SchemaTypes } = require("mongoose");

const user = new Schema(
  {
    name: { type: String, unique: true },
    password: { type: String },
    avatar: { type: String },
    // Planner Specifics
    type: { type: String, enum: ["Customer", "Planner"] },
    events: [{ type: SchemaTypes.ObjectId, ref: "events" }],
    orders: [{ type: SchemaTypes.ObjectId, ref: "orders" }],
    states: [{ type: Object }],
    anonymous: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = user;
