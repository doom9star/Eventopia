const router = require("express").Router();

const { COOKIE_NAME, isDev } = require("../constants");
const isAuth = require("../middlewares/isAuth");

router.delete("/", isAuth, (_, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: isDev ? "lax" : "none",
    secure: !isDev,
  });
  return res.json({ status: "SUCCESS", data: null });
});

module.exports = router;
