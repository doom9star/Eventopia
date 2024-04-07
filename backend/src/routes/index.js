const router = require("express").Router();
const { connectDB } = require("../models/index");

let connected = false;

router.use("*", async (_, __, next) => {
  if (!connected) {
    await connectDB();
    connected = true;
  }
  next();
});
router.get("/", (_, res) => {
  return res.json({ message: "Hi, this is the eventopia API!" });
});

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/event", require("./event"));
router.use("/order", require("./order"));
router.use("/invitation", require("./invitation"));

module.exports = router;
