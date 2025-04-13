const router = require("express").Router();
const { FollowControllers } = require("../app/controllers");

router.post("/add", FollowControllers.handleAddFollow);
router.post("/remove", FollowControllers.handleUnFollow);

router.get("/check-follow", FollowControllers.handleCheckFollow);
router.get("/count-by-following", FollowControllers.handleCountByFollowing);
router.get("/count-by-follower", FollowControllers.handleCountByFollower);

module.exports = router;
