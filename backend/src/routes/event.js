const router = require("express").Router();

const isAuth = require("../middlewares/isAuth");
const { getEventModel, getUserModel } = require("../models");

router
  .route("/")
  .all(isAuth)
  .get(async (_, res) => {
    try {
      const events = await getEventModel()
        .find({})
        .select("name images price")
        .populate({ path: "planner", select: "name" })
        .exec();
      return res.json({ status: "SUCCESS", data: events });
    } catch (error) {
      console.error(error);
      return res.json({ status: "ERROR", data: { message: error.message } });
    }
  })
  .post(async (req, res) => {
    try {
      const event = await getEventModel().create({
        ...req.body,
        planner: req.uid,
      });

      return res.json({ status: "SUCCESS", data: event });
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
      const event = await getEventModel()
        .findOne({ _id: req.params.id })
        .select("name price type images description states")
        .populate({ path: "planner", select: "name" })
        .exec();
      return res.json({ status: "SUCCESS", data: event });
    } catch (error) {
      console.error(error);
      return res.json({ status: "ERROR", data: { message: error.message } });
    }
  })
  .delete(async (req, res) => {
    try {
      await getEventModel().deleteOne({ _id: req.params.id });
      return res.json({ status: "SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      return res.json({ status: "ERROR", data: { message: error.message } });
    }
  })
  .put(async (req, res) => {
    try {
      await getEventModel().updateOne({ _id: req.params.id }, req.body);
      return res.json({ status: "SUCCESS", data: null });
    } catch (error) {
      console.error(error);
      return res.json({ status: "ERROR", data: { message: error.message } });
    }
  });

module.exports = router;
