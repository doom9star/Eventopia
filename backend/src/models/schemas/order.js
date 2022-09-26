const { Schema, SchemaTypes } = require("mongoose");

const order = new Schema(
  {
    planner: { type: SchemaTypes.ObjectId, ref: "users" },
    customer: { type: SchemaTypes.ObjectId, ref: "users" },
    event: { type: SchemaTypes.ObjectId, ref: "events" },
    guests: [{ type: SchemaTypes.ObjectId, ref: "users" }],
    status: {
      type: String,
      enum: ["Ordered", "Seen", "Accepted", "Completed", "Rejected"],
    },
    date: { type: Date },
    time: { type: Date },
    info: { type: String },
    duration: { type: Date },
    invite: { type: Boolean },
    contact: { type: Number },
    address: { type: String },
    expiry: { type: Date },
  },
  { timestamps: true }
);

module.exports = order;
