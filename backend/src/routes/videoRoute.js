const router = require("express").Router();
const { VideoControllers } = require("../app/controllers");

router.get("/recommend", VideoControllers.handleRecomendedVideos);
router.get("/following", VideoControllers.handleGetVideoByFollowing);

module.exports = router;
