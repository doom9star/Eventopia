const router = require("express").Router();

router.use("/me", require("./me"));
router.use("/register", require("./register"));
router.use("/login", require("./login"));
router.use("/logout", require("./logout"));

module.exports = router;
