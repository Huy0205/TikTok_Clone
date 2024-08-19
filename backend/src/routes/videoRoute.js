const router = require("express").Router();
const { VideoControllers } = require("../app/controllers");

router.get("/recommended", VideoControllers.handleRecomendedVideos);
router.get("/following", VideoControllers.handleGetVideoByFollowing);
router.get("/publisher", VideoControllers.handleGetVideoByPublisherId);
router.get("/liked", VideoControllers.handleGetVideoUserLiked);

module.exports = router;
