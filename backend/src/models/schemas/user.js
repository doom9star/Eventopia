const { Schema, SchemaTypes } = require("mongoose");

const user = new Schema(
  {
    name: String,
    avatar: String,
    password: String,
    anonymous: Boolean,
    type: { type: String, enum: ["Customer", "Planner"] },
  },
  { timestamps: true }
);

module.exports = user;
