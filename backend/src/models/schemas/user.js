const { Schema } = require("mongoose");

const user = new Schema(
  {
    name: { type: String, unique: true },
    avatar: String,
    password: String,
    type: { type: String, enum: ["Customer", "Planner"] },
  },
  { timestamps: true }
);

module.exports = user;
