const mongoose = require("mongoose");
const UserSchema = require("./schemas/user");
const OrderSchema = require("./schemas/order");
const EventSchema = require("./schemas/event");
const InvitationSchema = require("./schemas/invitation");

var UserModel = undefined;
var OrderModel = undefined;
var EventModel = undefined;
var InvitationModel = undefined;

const getUserModel = () => {
  return UserModel;
};

const getOrderModel = () => {
  return OrderModel;
};

const getEventModel = () => {
  return EventModel;
};

const getInvitationModel = () => {
  return InvitationModel;
};

const connectDB = async () => {
  return new Promise((res, rej) =>
    mongoose
      .connect(process.env.MONGO, { dbName: "sjcminorproject" })
      .then(() => {
        UserModel = mongoose.model("users", UserSchema);
        OrderModel = mongoose.model("orders", OrderSchema);
        EventModel = mongoose.model("events", EventSchema);
        InvitationModel = mongoose.model("invitations", InvitationSchema);
        console.log("\nmongoDB-atlas connected successfully!");
        res();
      })
      .catch((err) => rej(err))
  );
};

module.exports = {
  connectDB,
  getUserModel,
  getOrderModel,
  getEventModel,
  getInvitationModel,
};
