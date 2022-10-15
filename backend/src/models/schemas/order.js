const { Schema, SchemaTypes } = require("mongoose");

const order = new Schema(
  {
    date: String,
    info: String,
    state: String,
    address: String,
    contact: Number,
    end_time: String,
    start_time: String,
    expiry_date: String,
    event: { type: SchemaTypes.ObjectId, ref: "events" },
    planner: { type: SchemaTypes.ObjectId, ref: "users" },
    customer: { type: SchemaTypes.ObjectId, ref: "users" },
    guests: [{ type: SchemaTypes.ObjectId, ref: "users" }],
    status: {
      type: String,
      enum: ["Ordered", "Seen", "Accepted", "Completed", "Rejected"],
    },
    invite: {
      type: String,
      enum: ["Refused", "Pending", "Sent"],
    },
  },
  { timestamps: true }
);

module.exports = order;
