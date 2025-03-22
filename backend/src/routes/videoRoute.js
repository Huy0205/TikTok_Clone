const router = require("express").Router();
const { VideoControllers } = require("../app/controllers");
const { uploadVideo } = require("../middleware");

router.get("/recommended", VideoControllers.handleRecomendedVideos);
router.get("/following", VideoControllers.handleGetVideoByFollowing);
router.get("/publisher", VideoControllers.handleGetVideoByPublisherId);
router.get("/liked", VideoControllers.handleGetVideoUserLiked);
router.get("/saved", VideoControllers.handleGetVideoUserSaved);

router.post("/add", VideoControllers.handleSaveVideo);
router.post(
  "/upload",
  uploadVideo.single("video"),
  VideoControllers.handleUploadVideo
);

module.exports = router;
