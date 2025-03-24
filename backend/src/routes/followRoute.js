const router = require("express").Router();
const { FollowControllers } = require("../app/controllers");

router.post("/add", FollowControllers.handleAddFollow);
router.post("/remove", FollowControllers.handleUnFollow);
router.post("/:followingId", FollowControllers.handleCheckFollow);

router.get("/count-of-user", FollowControllers.handleCountFollowOfUser);

module.exports = router;
