const router = require("express").Router();

const isAuth = require("../middlewares/isAuth");
const { getEventModel, getUserModel } = require("../models");

router.get("/:id", isAuth, async (req, res) => {
  try {
    const event = await getEventModel()
      .findOne({ _id: req.params.id })
      .populate("planner")
      .exec();
    return res.json({ status: "SUCCESS", data: event });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.post("/", isAuth, async (req, res) => {
  try {
    const event = await getEventModel().create({
      ...req.body,
      planner: req.uid,
    });
    const planner = await getUserModel().findOne({ _id: req.uid }).exec();
    planner.events.push(event._id);
    await planner.save();

    return res.json({ status: "SUCCESS", data: event });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.put("/", isAuth, async (req, res) => {
  try {
    const { eid, event } = req.body;
    await getEventModel().updateOne({ _id: eid }, event);
    return res.json({ status: "SUCCESS", data: null });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    await getEventModel().deleteOne({ _id: req.params.id });
    return res.json({ status: "SUCCESS", data: null });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

module.exports = router;
