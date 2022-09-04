const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { getUserModel, getEventModel } = require("../models");
const isNotAuth = require("../middlewares/isNotAuth");
const isAuth = require("../middlewares/isAuth");
const { COOKIE_NAME, isDev } = require("../constants");

router.post("/register", isNotAuth, async (req, res) => {
  try {
    const user = new (getUserModel())({
      name: req.body.name,
      password: await bcrypt.hash(req.body.password, 10),
      avatar: req.body.avatar,
      type: req.body.type,
      countries: req.body.countries,
      states: req.body.states,
      anonymous: req.body.anonymous,
      events: [],
    });

    for (const _event of req.body.events) {
      const event = await getEventModel().create({
        ..._event,
        planner: user._id,
      });
      user.events.push(event._id);
    }

    if (user.type === "Planner" && user.events.length === 0) {
      const error = new Error("planner must contain atleast one event!");
      error.code = 11001;
      throw error;
    }
    await user.save();

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
    if (error.code === 11000)
      return res.json({
        status: "ERROR",
        data: { name: "username already exists!" },
      });
    if (error.code === 11001) {
      return res.json({
        status: "ERROR",
        data: { events: error.message },
      });
    }
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.post("/login", isNotAuth, async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await getUserModel()
      .findOne({ name })
      .populate("events")
      .exec();

    if (!user) throw new Error("user does not exist!");
    if (!(await bcrypt.compare(password, user.password)))
      throw new Error("wrong credentials!");

    const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie(COOKIE_NAME, token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: isDev ? "lax" : "none",
      secure: !isDev,
    });

    delete user.password;
    return res.json({ status: "SUCCESS", data: user });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

router.delete("/logout", isAuth, (_, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: isDev ? "lax" : "none",
    secure: !isDev,
  });
  return res.json({ status: "SUCCESS", data: null });
});

module.exports = router;
