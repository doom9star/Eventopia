const { JsonWebTokenError, verify } = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const ecid = req.cookies.ecid;
    if (!ecid) throw new JsonWebTokenError("Token is undefined!");
    const payload = verify(ecid, process.env.JWT_SECRET);
    req.uid = payload.uid;
    next();
  } catch (error) {
    return res.json({
      status: "ERROR",
      data: { message: "User is not authenticated!" },
    });
  }
};
