const { JsonWebTokenError, verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const ecid = req.cookies.ecid;
    if (!ecid) throw new JsonWebTokenError("Token is undefined!");
    verify(ecid, process.env.JWT_SECRET);
    return res.json({
      status: "ERROR",
      data: { message: "User is authenticated!" },
    });
  } catch (error) {
    next();
  }
};
