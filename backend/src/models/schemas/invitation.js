const { Schema, SchemaTypes } = require("mongoose");

const invitation = new Schema(
  {
    date: String,
    time: String,
    read: Boolean,
    address: String,
    description: String,
    event: { type: SchemaTypes.ObjectId, ref: "events" },
    inviter: { type: SchemaTypes.ObjectId, ref: "users" },
    invitee: { type: SchemaTypes.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = invitation;
