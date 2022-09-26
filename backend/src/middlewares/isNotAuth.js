const { JsonWebTokenError, verify } = require("jsonwebtoken");
const { COOKIE_NAME } = require("../constants");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) throw new JsonWebTokenError("token is undefined!");
    verify(token, process.env.JWT_SECRET);
    return res.json({
      status: "ERROR",
      data: { message: "user is authenticated!" },
    });
  } catch (error) {
    next();
  }
};
