const isAuth = require("../middlewares/isAuth");
const { getInvitationModel, getOrderModel } = require("../models");

const router = require("express").Router();

router
  .route("/")
  .all(isAuth)
  .get(async (req, res) => {
    try {
      const invitations = await getInvitationModel()
        .find({ invitee: req.uid })
        .select("createdAt")
        .populate({
          path: "event",
          select: "name images",
        })
        .populate({
          path: "inviter",
          select: "name",
        })
        .sort({ createdAt: -1 })
        .exec();
      return res.json({ status: "SUCCESS", data: invitations });
    } catch (error) {
      console.error(error);
      return res.json({ status: "ERROR", data: { message: error.message } });
    }
  })
  .post(async (req, res) => {
    try {
      const { oid } = req.body;
      const order = await getOrderModel()
        .findOne({ _id: oid })
        .populate("event")
        .exec();

      for (const guest of order.guests) {
        await getInvitationModel().create({
          inviter: order.customer,
          event: order.event._id,
          invitee: guest,
          title: `${order.event.name} Invitation`,
          description:
            "Once there, click on the Fork button in the top-right corner. This creates a new copy of my demo repo under your GitHub user account with a URL like:",
          date: order.date,
          start_time: order.start_time,
          end_time: order.end_time,
          state: order.state,
          address: order.address,
        });
      }
      order.invite = "Sent";
      await order.save();

      return res.json({ status: "SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      return res.json({ status: "ERROR", data: { message: error.message } });
    }
  });

router.get("/:id", isAuth, async (req, res) => {
  try {
    const invitation = await getInvitationModel()
      .findOne({ _id: req.params.id })
      .select("date read state address start_time end_time description")
      .populate({
        path: "event",
        select: "name images",
      })
      .populate({
        path: "inviter",
        select: "name avatar",
      })
      .exec();
    return res.json({ status: "SUCCESS", data: invitation });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

module.exports = router;
