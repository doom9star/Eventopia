const { Schema, SchemaTypes } = require("mongoose");

const invitation = new Schema(
  {
    date: String,
    title: String,
    read: Boolean,
    state: String,
    address: String,
    end_time: String,
    start_time: String,
    description: String,
    event: { type: SchemaTypes.ObjectId, ref: "events" },
    inviter: { type: SchemaTypes.ObjectId, ref: "users" },
    invitee: { type: SchemaTypes.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = invitation;
