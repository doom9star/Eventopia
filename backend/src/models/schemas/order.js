const { Schema, SchemaTypes } = require("mongoose");

const order = new Schema(
  {
    customer: { type: SchemaTypes.ObjectId, ref: "users" },
    guests: [{ type: SchemaTypes.ObjectId, ref: "users" }],
    status: {
      type: String,
      enum: ["Ordered", "Seen", "Accepted", "Completed", "Rejected"],
    },
    date: { type: Date },
    state: { type: String },
    country: { type: String },
    place: { type: String },
    invite: { type: Boolean },
    contact: { type: Number },
    start_time: { type: Date },
    duration: { type: String },
    additional_info: { type: String },
  },
  { timestamps: true }
);

module.exports = order;
