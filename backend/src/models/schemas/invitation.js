const { Schema, SchemaTypes } = require("mongoose");

const invitation = new Schema(
  {
    inviter: { type: SchemaTypes.ObjectId, ref: "users" },
    invitee: { type: SchemaTypes.ObjectId, ref: "users" },
    event: { type: SchemaTypes.ObjectId, ref: "events" },
    title: { type: String },
    description: { type: String },
    date: { type: Date },
    start_time: { type: Date },
    end_time: { type: Date },
    address: { type: String },
    read: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = invitation;
