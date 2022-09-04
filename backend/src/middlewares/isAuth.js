const { JsonWebTokenError, verify } = require("jsonwebtoken");
const { COOKIE_NAME } = require("../constants");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) throw new JsonWebTokenError("token is undefined!");
    const payload = verify(token, process.env.JWT_SECRET);
    req.uid = payload.uid;
    next();
  } catch (error) {
    return res.json({
      status: "ERROR",
      data: { message: "user is not authenticated!" },
    });
  }
};
