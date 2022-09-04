const router = require("express").Router();

const { getUserModel, getEventModel } = require("../models");
const isAuth = require("../middlewares/isAuth");

router.get("/:id?", isAuth, async (req, res) => {
  try {
    const user = await getUserModel()
      .findById(req.query.id ? req.query.id : req.uid)
      .select("-password")
      .populate("events")
      .exec();
    return res.json({ status: "SUCCESS", data: user });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.put("/", isAuth, async (req, res) => {
  try {
    const { events, ...others } = req.body;
    const _events = await getEventModel().find({ planner: req.uid }).exec();
    let _events_copy = [..._events];
    const event_ids = [];

    for (const event of events) {
      const eidx = _events.findIndex((e) => e.id === event._id);
      if (typeof eidx === "number" && eidx !== -1) {
        const { _id: eid, ...e } = event;
        await getEventModel().updateOne({ _id: eid }, e);
        _events_copy = _events_copy.filter((_e) => _e.id !== eid);
        event_ids.push(eid);
      } else {
        const e = await getEventModel().create({
          ...event,
          planner: req.uid,
        });
        event_ids.push(e._id);
      }
    }

    for (const event of _events_copy) {
      await getEventModel().deleteOne({ _id: event._id });
    }

    await getUserModel().updateOne(req.uid, { events: event_ids, ...others });
    const user = await getUserModel()
      .findById(req.uid)
      .select("-password")
      .populate("events")
      .exec();

    return res.json({ status: "SUCCESS", data: user });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

module.exports = router;
