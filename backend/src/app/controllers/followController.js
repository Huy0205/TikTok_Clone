const { FollowServices } = require("../services");

const handleCheckFollow = async (req, res) => {
  const {
    user: { tiktokId },
  } = req;
  const { followingId } = req.params;
  if (!followingId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "followingId is required",
    });
  }
  const response = await FollowServices.checkFollow(tiktokId, followingId);
  return res.status(response.status).json(response);
};

const handleCountFollowOfUser = async (req, res) => {
  const { tiktokId } = req.query;
  if (!tiktokId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "tiktokId is required",
    });
  }
  const response = await FollowServices.countFollowOfUser(tiktokId);
  return res.status(response.status).json(response);
};

const handleAddFollow = async (req, res) => {
  const {
    user: { tiktokId },
  } = req;
  const { followingId } = req.body;
  console.log(followingId, tiktokId, "handleAddFollow");
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
  handleCountFollowOfUser,
  handleAddFollow,
  handleUnFollow,
};
