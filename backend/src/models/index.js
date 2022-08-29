const mongoose = require("mongoose");
const UserSchema = require("./schemas/user");

var UserModel = undefined;

const getUserModel = () => {
  return UserModel;
};

const connectDB = async () => {
  return new Promise((res, rej) =>
    mongoose
      .connect(process.env.MONGO, { dbName: "expeder" })
      .then(() => {
        UserModel = mongoose.model("users", UserSchema);
        console.log("\nmongo-atlas connected successfully!");
        res();
      })
      .catch((err) => rej(err))
  );
};

module.exports = {
  connectDB,
  getUserModel,
};
