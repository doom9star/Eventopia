const router = require("express").Router();

const { getUserModel } = require("../models");
const isAuth = require("../middlewares/isAuth");

router.get("/:id?", isAuth, async (req, res) => {
  try {
    const user = await getUserModel()
      .findById(req.query.id ? req.query.id : req.uid)
      .select("name avatar anonymous type")
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
    if (error.code === 11000)
      return res.json({
        status: "ERROR",
        data: { message: "username already exists!" },
      });
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.get("/search/:query", isAuth, async (req, res) => {
  try {
    const users = await getUserModel()
      .find({ name: { $regex: ".*" + req.params.query + ".*" } })
      .select("name avatar")
      .exec();
    return res.json({ status: "SUCCESS", data: users });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

module.exports = router;
