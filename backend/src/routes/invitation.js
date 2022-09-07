const isAuth = require("../middlewares/isAuth");
const { getInvitationModel } = require("../models");

const router = require("express").Router();

router.get("/", isAuth, async (req, res) => {
  try {
    const invitations = await getInvitationModel()
      .find({ invitee: req.uid })
      .exec();
    return res.json({ status: "SUCCESS", data: invitations });
  } catch (error) {
    console.error(error);
    return res.json({ status: "ERROR", data: { message: error.message } });
  }
});

module.exports = router;
