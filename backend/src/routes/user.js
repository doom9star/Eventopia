const router = require("express").Router();

const {
  getUserModel,
  getEventModel,
  getOrderModel,
  getInvitationModel,
} = require("../models");
const isAuth = require("../middlewares/isAuth");

router.get("/:id?", isAuth, async (req, res) => {
  try {
    const user = await getUserModel()
      .findById(req.query.id ? req.query.id : req.uid)
      .select("-password")
      .populate({
        path: "orders",
        populate: [
          {
            path: "event",
          },
          {
            path: "customer",
          },
        ],
        select: "event customer createdAt status",
      })
      .populate({
        path: "events",
        populate: [
          {
            path: "planner",
          },
        ],
        select: "name images min_price planner",
      })
      .populate({
        path: "invitations",
        populate: [
          {
            path: "inviter",
          },
          {
            path: "event",
          },
        ],
      })
      .exec();

    if (user.type === "Customer") {
      user.events = await getEventModel()
        .find()
        .populate("planner")
        .select("name images min_price planner")
        .exec();
      user.orders = await getOrderModel()
        .find({ customer: user._id })
        .populate("event")
        .populate("planner")
        .select("event planner createdAt status")
        .exec();
    }

    return res.json({ status: "SUCCESS", data: user });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.put("/", isAuth, async (req, res) => {
  try {
    await getUserModel().updateOne({ _id: req.uid }, req.body);
    return res.json({ status: "SUCCESS", data: null });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

module.exports = router;
