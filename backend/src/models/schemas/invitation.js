const { Schema, SchemaTypes } = require("mongoose");

const invitation = new Schema(
  {
    inviter: { type: SchemaTypes.ObjectId, ref: "users" },
    invitee: { type: SchemaTypes.ObjectId, ref: "users" },
    title: { type: String },
    description: { type: String },
    date: { type: Date },
    time: { type: Date },
    duration: { type: Date },
    address: { type: String },
    read: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = invitation;
