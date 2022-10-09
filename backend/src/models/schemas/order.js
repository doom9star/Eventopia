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
    start_time: { type: Date },
    end_time: { type: Date },
    state: { type: String },
    place: { type: String },
    contact: { type: Number },
    info: { type: String },
    invite: {
      type: String,
      enum: ["Refused", "Pending", "Sent"],
    },
  },
  { timestamps: true }
);

module.exports = order;
