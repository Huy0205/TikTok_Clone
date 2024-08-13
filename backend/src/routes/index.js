const router = require("express").Router();
const userRoutes = require("./userRoute");
const keywordRoutes = require("./keywordRoute");
const videoRoutes = require("./videoRoute");
const { auth } = require("../middleware");

router.all("*", auth);

router.use("/user", userRoutes);
router.use("/keyword", keywordRoutes);
router.use("/video", videoRoutes);

module.exports = router;
