const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/event", require("./event"));
router.use("/order", require("./order"));
router.use("/invitation", require("./invitation"));

module.exports = router;
