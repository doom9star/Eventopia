const router = require("express").Router();

const isAuth = require("../middlewares/isAuth");
const {
  getOrderModel,
  getInvitationModel,
  getUserModel,
} = require("../models");

router.get("/:type?", isAuth, async (req, res) => {
  try {
    const orders = req.query.type
      ? await getOrderModel()
          .find({ [req.query.type]: req.uid })
          .exec()
      : [];
    if (req.query.type === "planner") {
      for (const order of orders) {
        if (order.status === "Ordered") {
          order.status = "Seen";
          await order.save();
        }
      }
    }
    return res.json({ status: "SUCCESS", data: orders });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.post("/", isAuth, async (req, res) => {
  try {
    const order = await getOrderModel().create({
      ...req.body,
      customer: req.uid,
      status: "Ordered",
    });
    await getUserModel().updateOne(
      { _id: req.uid },
      { $addToSet: { orders: [order._id] } }
    );
    return res.json({ status: "SUCCESS", data: order });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.put("/", isAuth, async (req, res) => {
  try {
    const order = await getOrderModel()
      .findOne({ _id: req.body.oid })
      .populate("event")
      .exec();
    order.status = req.body.status;
    await order.save();
    if (req.body.status === "Accepted" && order.invite) {
      for (const gid of order.guests) {
        await getInvitationModel().create({
          inviter: order.customer,
          invitee: gid,
          title: `${order.event.name} Invitation`,
          description:
            "Once there, click on the Fork button in the top-right corner. This creates a new copy of my demo repo under your GitHub user account with a URL like:",
          date: order.date,
          time: order.time,
          duration: order.duration,
          address: order.address,
        });
      }
    }
    return res.json({ status: "SUCCESS", data: null });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

module.exports = router;
