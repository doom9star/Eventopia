const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { getUserModel } = require("../models");
const isNotAuth = require("../middlewares/isNotAuth");
const { COOKIE_NAME, isDev } = require("../constants");

router.post("/", isNotAuth, async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await getUserModel().findOne({ name }).exec();

    if (!user) throw new Error("User does not exist!");
    if (!(await bcrypt.compare(password, user.password)))
      throw new Error("Wrong credentials!");

    const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie(COOKIE_NAME, token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: isDev ? "lax" : "none",
      secure: !isDev,
    });

    return res.json({ status: "SUCCESS", data: user });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

module.exports = router;
