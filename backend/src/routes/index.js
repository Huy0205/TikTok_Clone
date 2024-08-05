const router = require("express").Router();
const userRoutes = require("./userRoute");
const keywordRoutes = require("./keywordRoute");
const { auth } = require("../middleware");

router.all("*", auth);

router.use("/user", userRoutes);
router.use("/keyword", keywordRoutes);

module.exports = router;
