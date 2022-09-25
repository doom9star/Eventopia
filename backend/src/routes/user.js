const router = require("express").Router();

const { getUserModel } = require("../models");
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
    await getUserModel().updateOne({ _id: req.uid }, req.body);
    return res.json({ status: "SUCCESS", data: null });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

module.exports = router;
