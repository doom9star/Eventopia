const router = require("express").Router();

const isAuth = require("../middlewares/isAuth");
const { getOrderModel } = require("../models");

router.post("/", isAuth, async (req, res) => {
  try {
    const order = await getOrderModel().create({
      ...req.body,
      customer: req.uid,
      status: "Ordered",
    });
    return res.json({ status: "SUCCESS", data: order });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.get("/many/:type", isAuth, async (req, res) => {
  try {
    const orders = await getOrderModel()
      .find({ [req.params.type.toLowerCase()]: req.uid })
      .select("createdAt status")
      .populate({
        path: "event",
        select: "name images",
      })
      .populate({
        path: req.params.type === "Customer" ? "planner" : "customer",
        select: "name",
      })
      .sort({ createdAt: -1 })
      .exec();

    if (orders.length > 0 && req.params.type === "Planner") {
      for (const order of orders) {
        if (order.status === "Ordered") {
          order.status = "Seen";
          await order.save();
        }
      }
    }

    const today = new Date();
    await getOrderModel().deleteMany({
      $or: [{ status: "Ordered" }, { status: "Seen" }],
      expiry_date: {
        $lte: `${today.getFullYear()}-${
          today.getMonth() + 1
        }-${today.getDate()}`,
      },
    });

    return res.json({ status: "SUCCESS", data: orders });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router
  .route("/:id")
  .all(isAuth)
  .get(async (req, res) => {
    try {
      const order = await getOrderModel()
        .findOne({ _id: req.params.id })
        .select(
          "date start_time end_time state address contact info invite status"
        )
        .populate({
          path: "customer",
          select: "name avatar",
        })
        .populate({
          path: "event",
          select: "name",
        })
        .populate({
          path: "guests",
          select: "name avatar",
        })
        .exec();
      return res.json({ status: "SUCCESS", data: order });
    } catch (error) {
      console.error(error);
      return res.json({ status: "ERROR", data: { message: error.message } });
    }
  })
  .put(async (req, res) => {
    try {
      await getOrderModel().updateOne({ _id: req.params.id }, req.body);
      return res.json({ status: "SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      return res.json({ status: "ERROR", data: { message: error.message } });
    }
  });

module.exports = router;
