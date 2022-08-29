const { Schema } = require("mongoose");

const user = new Schema(
  {
    name: String,
    password: String,
  },
  { timestamps: true }
);

module.exports = user;
