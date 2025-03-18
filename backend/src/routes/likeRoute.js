const { LikeController } = require("../app/controllers");

const router = require("express").Router();

router.get("/count-by-videoId", LikeController.handleCountLikesByVideoId);

router.post("/save", LikeController.handleSaveLike);

router.delete("/delete", LikeController.handleDeleteLike);

module.exports = router;
