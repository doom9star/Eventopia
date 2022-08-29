const isAuth = require("../middlewares/isAuth");
const { getUserModel } = require("../models");

const router = require("express").Router();

router.get("/", isAuth, async (req, res) => {
  try {
    const user = await getUserModel().findById(req.uid).exec();
    return res.json({ status: "SUCCESS", data: user });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

module.exports = router;
