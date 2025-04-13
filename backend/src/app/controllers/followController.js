const { FollowServices } = require("../services");

const handleCheckFollow = async (req, res) => {
  const { followerId, followingId } = req.query;
  if (!followerId || !followingId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "followerId, followingId is required",
    });
  }
  const response = await FollowServices.checkFollow(followerId, followingId);
  return res.status(response.status).json(response);
};

const handleCountByFollowing = async (req, res) => {
  const { tiktokId } = req.query;
  if (!tiktokId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "tiktokId is required",
    });
  }
  const response = await FollowServices.countByFollowing(tiktokId);
  return res.status(response.status).json(response);
};

const handleCountByFollower = async (req, res) => {
  const { tiktokId } = req.query;
  if (!tiktokId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "tiktokId is required",
    });
  }
  const response = await FollowServices.countByFollower(tiktokId);
  return res.status(response.status).json(response);
};

const handleAddFollow = async (req, res) => {
  const {
    user: { tiktokId },
  } = req;
  const { followingId } = req.body;
  if (!followingId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "followingId is required",
    });
  }
  const response = await FollowServices.addFollow(tiktokId, followingId);
  return res.status(response.status).json(response);
};

const handleUnFollow = async (req, res) => {
  const {
    user: { tiktokId },
  } = req;
  const { followingId } = req.body;
  if (!followingId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "followingId is required",
    });
  }
  const response = await FollowServices.removeFollow(tiktokId, followingId);
  return res.status(response.status).json(response);
};

module.exports = {
  handleCheckFollow,
  handleCountByFollowing,
  handleCountByFollower,
  handleAddFollow,
  handleUnFollow,
};
